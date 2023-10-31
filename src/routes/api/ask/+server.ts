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
	loadLetterMessages,
	setRating
} from '$lib/supabase_full.server';
import { ChatMode, type ChatMessage } from '$misc/shared';
import { createParser } from 'eventsource-parser';
import type { Session } from '@supabase/supabase-js';
import { nonStreamRequest } from './llangchain_ask';
import { HumanMessage } from 'langchain/schema';

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
	infoModelMessages.push(new HumanMessage({ content: promptMessage }));
	const response = await nonStreamRequest(infoModelMessages);
	const responseMessage = response.content;
	console.log('got message from langchain');
	console.log(responseMessage);
	//const completionOpts = createChatCompletionRequest(ChatMode.Request, [...infoModelMessages, { role: 'user', content: promptMessage }]);

	//const responseJson = await (await createGptResponseAndHandleError(completionOpts)).json();
	//const responseMessage = responseJson.choices[0].message.content;

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, responseMessage);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	//const backendMessages = await loadLetterMessages(userId, mysteryName);
	//if (!backendMessages) {
	//	throw error(500, 'Could not load backend messages');
	//}
	//let messages: ChatMessage[] = backendMessages.promptMessages;
	//const ogLength = messages.length;
	//for (let i = ogLength; i < infoModelMessages.length; i += 2) {
	//	messages.push({
	//		role: 'user',
	//		content: 'Order:\n' + infoModelMessages[i].content + '\nInformation:\n' + infoModelMessages[i + 1].content
	//	});
	//	messages.push(backendMessages.responseMessages[(i - ogLength) / 2]);
	//}

	//if (messages.length > 7) {
	//	//This is needed to keep the token counts low
	//	const firstElement = messages[0];
	//	const lastSixElements = messages.slice(-6);
	//	messages = [firstElement, ...lastSixElements];
	//}

	//messages.push({
	//	role: 'user',
	//	content: 'Order:\n' + promptMessage + '\nInformation:\n' + responseMessage
	//});
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

	const backendMessages = await loadLetterMessages(userId, mysteryName);
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

	let savedController: ReadableStreamDefaultController;
	let controllerOpen = true;
	const processedStream = new ReadableStream({
		async start(controller) {
			savedController = controller;
		},
		async cancel(controller) {
			controllerOpen = false;
		}
	});

	async function parseStreamAndEnque() {
		const parser = createParser(onParse);

		let message = '';
		let closed = false;
		async function onParse(event) {
			if (event.type !== 'event' || closed) return;

			if (event.data === '[DONE]') {
				closed = true;
				const addedMessage = await addMessageForUser(userId, message, mysteryName);
				throwIfFalse(addedMessage, 'Could not add message to chat');
				if (controllerOpen) {
					savedController.enqueue(encoder.encode('data: [DONE]\n\n'));
					savedController.close();
				}
				return;
			} else {
				try {
					const content = JSON.parse(event.data).choices[0].delta?.content || '';
					message += content;
					if (content && controllerOpen) {
						savedController.enqueue(formatData(content, encoder));
					}
				} catch (e) {
					console.error(e);
				}
			}
		}
		for await (const value of response.body.pipeThrough(new TextDecoderStream())) {
			parser.feed(value);
		}
	}
	parseStreamAndEnque();

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
