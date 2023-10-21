import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import {
	addMessageForUser,
	archiveLastConversation,
	decreaseMessageForUser,
	getAccusePrompt,
	getMessageAmountForUser,
	setRating
} from '$lib/supabase_full.server';
import { ChatMode } from '$misc/shared';
import { createParser } from 'eventsource-parser';

const openAiKey: string = OPEN_AI_KEY;

function createChatCompletionRequest(
	chatMode: ChatMode,
	messages: ChatCompletionRequestMessage[],
	suspectToAccuse: string,
	ratingPrompt: string
): CreateChatCompletionRequest {
	switch (chatMode) {
		case ChatMode.Chat: {
			return {
				...defaultOpenAiSettings,
				messages,
				stream: true
			};
		}
		case ChatMode.Accuse: {
			return {
				...defaultOpenAiSettings,
				messages: [
					{
						role: 'user',
						content: ratingPrompt + '\n' + 'The murderer is: ' + suspectToAccuse + '\n' + messages[messages.length - 1].content
					}
				],
				stream: true
			};
		}
	}
}

function formatData(message: string, encoder: TextEncoder) {
	return encoder.encode(`data: ${JSON.stringify({ content: message })}\n\n`);
}

async function createGptResponse(completionOpts: CreateChatCompletionRequest) {
	const apiUrl = 'https://api.openai.com/v1/chat/completions';
	return await fetch(apiUrl, {
		headers: {
			Authorization: `Bearer ${openAiKey}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(completionOpts)
	});
}

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		throw error(500, 'You are not logged in.');
	}
	if ((await getMessageAmountForUser(session.user.id)) <= 0) {
		throw error(500, 'You have no messages.');
	}
	try {
		const requestData = await request.json();
		throwIfUnset('request data', requestData);
		const messages: ChatCompletionRequestMessage[] = requestData.messages;
		throwIfUnset('messages', messages);
		const game_config = requestData.game_config;
		throwIfUnset('game_config', game_config);
		const suspectToAccuse = game_config.suspectToAccuse;
		throwIfUnset('Mystery name', game_config.mysteryName);

		const chatMode = suspectToAccuse ? ChatMode.Accuse : ChatMode.Chat;
		if (chatMode == ChatMode.Accuse) {
			await archiveLastConversation(session.user.id, game_config.mysteryName);
		}

		const ratingPrompt = await getAccusePrompt(game_config.mysteryName);
		if (!ratingPrompt) {
			throw error(500, 'Could not get rating prompt');
		}

		const completionOpts = createChatCompletionRequest(chatMode, messages, suspectToAccuse, ratingPrompt);
		const response = await createGptResponse(completionOpts);
		await decreaseMessageForUser(session.user.id);

		if (!response.ok) {
			const err = await response.json();
			throw err.error;
		}

		const encoder = new TextEncoder();

		let parseRating = chatMode == ChatMode.Accuse ? true : false;

		const processedStream = new ReadableStream({
			async start(controller) {
				const parser = createParser(onParse);

				const RATING_REGEX = /Rating:\s?(\d+)/;
				const EPILOGUE_RATING_REGEX = /Rating:\s*\d+[\s\S]*?Epilogue:\s*\w/i;

				let message = '';
				async function onParse(event) {
					if (event.type !== 'event') return;

					if (event.data === '[DONE]') {
						//TODO is this really needed?
						controller.enqueue(encoder.encode('data: [DONE]\n\n'));
						const addedMessage = await addMessageForUser(session.user.id, message, game_config.mysteryName);
						throwIfFalse(addedMessage, 'Could not add message to chat');
						controller.close();
						return;
					}
					const content = JSON.parse(event.data).choices[0].delta?.content || '';
					if (parseRating) {
						if (EPILOGUE_RATING_REGEX.test(message)) {
							const ratingMatch = message.match(RATING_REGEX);
							if (!ratingMatch) {
								throw error(500, 'Could not parse rating');
							}
							message = message.replace(RATING_REGEX, '').replace(/Epilogue:\s?/, '');
							controller.enqueue(formatData(message, encoder));
							const ratingSet = await setRating(game_config.mysteryName, session.user.id, parseInt(ratingMatch[1]));
							throwIfFalse(ratingSet, 'Could not set rating');
							parseRating = false;
						} else {
							message += content;
						}
					} else {
						message += content;
						controller.enqueue(formatData(content, encoder));
					}
				}

				if (response.body == null) {
					throw error(500, 'No response from OpenAI');
				}
				for await (const value of response.body.pipeThrough(new TextDecoderStream())) {
					parser.feed(value);
				}
			}
		});

		const messageAdded = await addMessageForUser(session.user.id, messages[messages.length - 1].content, game_config.mysteryName);
		throwIfFalse(messageAdded, 'Could not add message to chat');

		return new Response(processedStream, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
