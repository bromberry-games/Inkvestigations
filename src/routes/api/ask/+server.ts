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
	loadBackendMessages,
	setRating
} from '$lib/supabase_full.server';
import { ChatMode, type ChatMessage } from '$misc/shared';
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
				stream: false
			};
		}
	}
}

function formatData(message: string, encoder: TextEncoder) {
	if (typeof message !== 'string') {
		throw error(500, 'Message is not a string');
	}
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

async function infoModelAnswer(mysteryName: string, promptMessage: string, userId: string) {
	const infoModelMessages = await getInfoModelMessages(userId, mysteryName);
	if (!infoModelMessages) {
		throw error(500, 'Could not get info model messages');
	}
	const completionOpts = createChatCompletionRequest(ChatMode.Request, [...infoModelMessages, { role: 'user', content: promptMessage }]);

	const responseJson = await (await createGptResponseAndHandleError(completionOpts)).json();
	const responseMessage = responseJson.choices[0].message.content;

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, responseMessage);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	const backendMessages = await loadBackendMessages(userId, mysteryName);
	if (!backendMessages) {
		throw error(500, 'Could not load backend messages');
	}
	const messages = backendMessages.promptMessages;
	const ogLength = messages.length;
	for (let i = ogLength; i < infoModelMessages.length; i += 2) {
		messages.push({
			role: 'user',
			content: 'Order:\n' + infoModelMessages[i].content + '\nInformation:\n' + infoModelMessages[i + 1].content
		});
		messages.push(backendMessages.responseMessages[(i - ogLength) / 2]);
	}

	messages.push({
		role: 'user',
		content: 'Order:\n' + promptMessage + '\nInformation:\n' + responseMessage
	});
	return createChatCompletionRequest(ChatMode.Letter, messages);
}

const RATING_REGEX = /Rating:\s?(\d+)/;

async function accuseModelAnswer(mysteryName: string, promptMessage: string, userId: string, suspectToAccuse: string) {
	const accusePrompt = await getAccusePrompt(mysteryName);
	if (!accusePrompt) {
		throw error(500, 'Could not get accuse prompt');
	}
	accusePrompt.push({
		role: 'user',
		content: accusePrompt + '\n' + 'The murderer is: ' + suspectToAccuse + '\n' + promptMessage
	});

	const completionOpts = createChatCompletionRequest(ChatMode.Accuse, accusePrompt);
	const responseJson = await (await createGptResponseAndHandleError(completionOpts)).json();
	const responseMessage = responseJson.choices[0].message.content;
	const ratingMatch = responseMessage.match(RATING_REGEX);
	if (!ratingMatch) {
		throw error(500, 'Could not parse rating');
	}
	const parsedMessage = responseMessage.replace(RATING_REGEX, '').replace(/Epilogue:\s?/, '');
	const ratingSet = await setRating(mysteryName, userId, parseInt(ratingMatch[1]));
	throwIfFalse(ratingSet, 'Could not set rating');

	const backendMessages = await loadBackendMessages(userId, mysteryName);
	if (!backendMessages) {
		throw error(500, 'Could not load backend messages');
	}
	backendMessages.promptMessages.push({
		role: 'user',
		content: 'Order:\n' + 'Accuse ' + suspectToAccuse + '\nInformation:\n' + parsedMessage
	});
	return createChatCompletionRequest(ChatMode.Letter, backendMessages.promptMessages);
}

async function twoMessageAnswer(mysteryName: string, promptMessage: string, userId: string, suspectToAccuse: string) {
	const streamingCompletionOpts = suspectToAccuse
		? await accuseModelAnswer(mysteryName, promptMessage, userId, suspectToAccuse)
		: await infoModelAnswer(mysteryName, promptMessage, userId);

	return handleStreamingAnswer(mysteryName, userId, streamingCompletionOpts);
}

async function handleStreamingAnswer(mysteryName: string, userId: string, completionOpts: CreateChatCompletionRequest) {
	const response = await createGptResponseAndHandleError(completionOpts);
	const encoder = new TextEncoder();
	if (response.status !== 200) {
		console.error(response.statusText);
		throw error(500, 'Could not create gpt response');
	}

	const processedStream = new ReadableStream({
		async start(controller) {
			const parser = createParser(onParse);

			let message = '';
			let closed = false;
			async function onParse(event) {
				if (event.type !== 'event' || closed) return;

				if (event.data === '[DONE]') {
					closed = true;
					controller.enqueue(encoder.encode('data: [DONE]\n\n'));
					const addedMessage = await addMessageForUser(userId, message, mysteryName);
					throwIfFalse(addedMessage, 'Could not add message to chat');
					controller.close();
					return;
				} else {
					try {
						const content = JSON.parse(event.data).choices[0].delta?.content || '';
						message += content;
						if (content) {
							controller.enqueue(formatData(content, encoder));
						}
					} catch (e) {
						console.error(e);
					}
				}
			}
			for await (const value of response.body.pipeThrough(new TextDecoderStream())) {
				parser.feed(value);
			}
		},
		async cancel() {
			console.log('canceled');
		}
	});

	return new Response(processedStream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}

//async function handleSuspectAccuseAnswer(
//	mysteryName: string,
//	chatMode: ChatMode,
//	messages: ChatCompletionRequestMessage[],
//	userId: string,
//	suspectToAccuse: string
//) {
//	const accusePrompt = getAccusePrompt(mysteryName);
//	if (!accusePrompt) {
//		throw error(500, 'Could not get accuse prompt');
//	}
//	const newMessages: ChatCompletionRequestMessage[] = [
//		{
//			role: 'user',
//			content: accusePrompt + '\n' + 'The murderer is: ' + suspectToAccuse + '\n' + messages[messages.length - 1].content
//		}
//	];
//
//	const completionOpts = createChatCompletionRequest(chatMode, messages);
//	const response = await createGptResponseAndHandleError(completionOpts);
//
//	const encoder = new TextEncoder();
//	let parseRating = chatMode == ChatMode.Accuse ? true : false;
//
//	const processedStream = new ReadableStream({
//		async start(controller) {
//			const parser = createParser(onParse);
//
//			const RATING_REGEX = /Rating:\s?(\d+)/;
//			const EPILOGUE_RATING_REGEX = /Rating:\s*\d+[\s\S]*?Epilogue:\s*\w/i;
//
//			let message = '';
//			async function onParse(event) {
//				if (event.type !== 'event') return;
//
//				if (event.data === '[DONE]') {
//					//TODO is this really needed?
//					controller.enqueue(encoder.encode('data: [DONE]\n\n'));
//					const addedMessage = await addMessageForUser(userId, message, mysteryName);
//					throwIfFalse(addedMessage, 'Could not add message to chat');
//					controller.close();
//					return;
//				}
//				const content = JSON.parse(event.data).choices[0].delta?.content || '';
//				if (parseRating) {
//					if (EPILOGUE_RATING_REGEX.test(message)) {
//						const ratingMatch = message.match(RATING_REGEX);
//						if (!ratingMatch) {
//							throw error(500, 'Could not parse rating');
//						}
//						message = message.replace(RATING_REGEX, '').replace(/Epilogue:\s?/, '');
//						controller.enqueue(formatData(message, encoder));
//						const ratingSet = await setRating(mysteryName, userId, parseInt(ratingMatch[1]));
//						throwIfFalse(ratingSet, 'Could not set rating');
//						parseRating = false;
//					} else {
//						message += content;
//					}
//				} else {
//					message += content;
//					controller.enqueue(formatData(content, encoder));
//				}
//			}
//
//			if (response.body == null) {
//				throw error(500, 'No response from OpenAI');
//			}
//			for await (const value of response.body.pipeThrough(new TextDecoderStream())) {
//				parser.feed(value);
//			}
//		}
//	});

//	const messageAdded = await addMessageForUser(userId, messages[messages.length - 1].content, mysteryName);
//	throwIfFalse(messageAdded, 'Could not add message to chat');
//
//	return new Response(processedStream, {
//		headers: {
//			'Content-Type': 'text/event-stream'
//		}
//	});
//}

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
		const message: string = requestData.message;
		throwIfUnset('messages', message);
		const game_config = requestData.game_config;
		throwIfUnset('game_config', game_config);
		const suspectToAccuse = game_config.suspectToAccuse ? game_config.suspectToAccuse : '';
		throwIfUnset('Mystery name', game_config.mysteryName);

		const messageAdded = await addMessageForUser(session.user.id, message, game_config.mysteryName);
		throwIfFalse(messageAdded, 'Could not add message to chat');

		if (suspectToAccuse) {
			await archiveLastConversation(session.user.id, game_config.mysteryName);
		}
		const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
		throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');

		return await twoMessageAnswer(game_config.mysteryName, message, session.user.id, suspectToAccuse);
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
