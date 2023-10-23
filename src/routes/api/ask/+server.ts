import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { OpenAiModel, defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import {
	addInfoModelMessage,
	addMessageForUser,
	archiveLastConversation,
	decreaseMessageForUser,
	getAccusePrompt,
	getInfoModelMessages,
	getMessageAmountForUser,
	setRating
} from '$lib/supabase_full.server';
import { ChatMode } from '$misc/shared';
import { createParser } from 'eventsource-parser';
import type { Session } from '@supabase/supabase-js';

const openAiKey: string = OPEN_AI_KEY;

function createChatCompletionRequest(chatMode: ChatMode, messages: ChatCompletionRequestMessage[]): CreateChatCompletionRequest {
	switch (chatMode) {
		case ChatMode.Request: {
			return {
				model: OpenAiModel.Gpt4,
				max_tokens: 200,
				temperature: 1,
				top_p: 1,
				messages,
				stream: false
			};
		}
		case ChatMode.Letter: {
			return {
				model: OpenAiModel.Gpt35Turbo,
				max_tokens: 512,
				temperature: 1,
				top_p: 1,
				messages,
				stream: true
			};
		}
		case ChatMode.Accuse: {
			return {
				model: OpenAiModel.Gpt4,
				max_tokens: 200,
				temperature: 1,
				top_p: 1,
				messages,
				stream: true
			};
		}
	}
}

function formatData(message: string, encoder: TextEncoder) {
	return encoder.encode(`data: ${JSON.stringify({ content: message })}\n\n`);
}

async function createGptResponseAndHandleError(completionOpts: CreateChatCompletionRequest) {
	const apiUrl = 'https://api.openai.com/v1/chat/completions';
	const response = await fetch(apiUrl, {
		headers: {
			Authorization: `Bearer ${openAiKey}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(completionOpts)
	});
	if (!response.ok) {
		const err = await response.json();
		throw err.error;
	}
	return response;
}

async function twoMessageAnswer(mysteryName: string, messages: ChatCompletionRequestMessage[], userId: string) {
	const infoModelMessages = await getInfoModelMessages(userId, mysteryName);
	if (!infoModelMessages) {
		throw error(500, 'Could not get info model messages');
	}
	const promptMessage = messages[messages.length - 1];
	const completionOpts = createChatCompletionRequest(ChatMode.Request, [...infoModelMessages, promptMessage]);
	const responseJson = await (await createGptResponseAndHandleError(completionOpts)).json();
	const responseMessage = responseJson.choices[0].message.content;

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, responseMessage);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	messages[messages.length - 1] = {
		role: 'user',
		content: '## Order\n' + promptMessage.content + '\n## Information\n' + responseMessage
	};
	return handleSuspectAccuseAnswer(mysteryName, ChatMode.Letter, messages, userId, 'bob');

	//return handleStreamingAnswer(messages, mysteryName, userId);
}

async function handleStreamingAnswer(messages: ChatCompletionRequestMessage[], mysteryName: string, userId: string) {
	console.log('prompt message');
	console.log(messages[messages.length - 1].content);
	console.log(messages);
	const completionOptsLetter = createChatCompletionRequest(ChatMode.Letter, messages);
	console.log(completionOptsLetter);
	const response = await createGptResponseAndHandleError(completionOptsLetter);

	const encoder = new TextEncoder();
	let parseRating = false;

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
					const addedMessage = await addMessageForUser(userId, message, mysteryName);
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
						//const ratingSet = await setRating(mysteryName, userId, parseInt(ratingMatch[1]));
						//throwIfFalse(ratingSet, 'Could not set rating');
						parseRating = false;
					} else {
						message += content;
					}
				} else {
					message += content;
					console.log(content);
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

	const messageAdded = await addMessageForUser(userId, messages[messages.length - 1].content, mysteryName);
	throwIfFalse(messageAdded, 'Could not add message to chat');

	return new Response(processedStream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}

async function handleSuspectAccuseAnswer(
	mysteryName: string,
	chatMode: ChatMode,
	messages: ChatCompletionRequestMessage[],
	userId: string,
	suspectToAccuse: string
) {
	const accusePrompt = getAccusePrompt(mysteryName);
	if (!accusePrompt) {
		throw error(500, 'Could not get accuse prompt');
	}
	const newMessages: ChatCompletionRequestMessage[] = [
		{
			role: 'user',
			content: accusePrompt + '\n' + 'The murderer is: ' + suspectToAccuse + '\n' + messages[messages.length - 1].content
		}
	];

	const completionOpts = createChatCompletionRequest(chatMode, messages);
	const response = await createGptResponseAndHandleError(completionOpts);

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
					const addedMessage = await addMessageForUser(userId, message, mysteryName);
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
						const ratingSet = await setRating(mysteryName, userId, parseInt(ratingMatch[1]));
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

	const messageAdded = await addMessageForUser(userId, messages[messages.length - 1].content, mysteryName);
	throwIfFalse(messageAdded, 'Could not add message to chat');

	return new Response(processedStream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const session: Session = await getSession();
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

		const chatMode = suspectToAccuse ? ChatMode.Accuse : ChatMode.Letter;
		if (chatMode == ChatMode.Accuse) {
			await archiveLastConversation(session.user.id, game_config.mysteryName);
		}

		//return await oneMessageAnswer(game_config.mysteryName, chatMode, messages, session.user.id);
		const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
		throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');

		return await twoMessageAnswer(game_config.mysteryName, messages, session.user.id);
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
