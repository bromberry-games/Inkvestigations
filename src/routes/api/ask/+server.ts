import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import type { Session } from '@supabase/supabase-js';
import { accuseModelRequest, brainModelRequest as brainModelRequest, letterModelRequest } from './llangchain_ask';
import { AIMessage, BaseMessage, HumanMessage } from 'langchain/schema';
import { loadGameInfo } from '$lib/supabase/mystery_data.server';
import {
	addInfoModelMessage,
	addMessageForUser,
	archiveLastConversation,
	getInfoModelMessages,
	loadDisplayMessages,
	setRating
} from '$lib/supabase/conversations.server';
import { getMessageAmountForUser, decreaseMessageForUser } from '$lib/supabase/message_amounts.server';
import { countTokens } from '$misc/openai';
import { MAX_TOKENS } from '../../../constants';

async function standardInvestigationAnswer(mysteryName: string, promptMessage: string, userId: string) {
	const infoModelMessages = await getInfoModelMessages(userId, mysteryName);
	if (!infoModelMessages) {
		throw error(500, 'Could not get info model messages');
	}
	const gameInfo = await loadGameInfo(mysteryName);
	if (!gameInfo) {
		throw error(500, 'Could not get game info');
	}
	const brainResponse = await brainModelRequest(gameInfo, infoModelMessages, promptMessage);

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, brainResponse);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	const assistantLetterAnswers = (await loadDisplayMessages(userId, mysteryName))?.filter((m) => m.role === 'assistant');
	if (!assistantLetterAnswers) {
		throw error(500, 'Could not load backend messages');
	}

	const messages: BaseMessage[] = [];
	for (let i = 0; i < infoModelMessages.length; i += 2) {
		messages.push(
			new HumanMessage({
				content: 'Order:\n' + infoModelMessages[i].content + '\nInformation:\n' + infoModelMessages[i + 1].content
			})
		);
		messages.push(new AIMessage({ content: assistantLetterAnswers[i / 2].content }));
	}
	const addResult = async (message: string) => {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
	};

	return letterModelRequest(gameInfo, messages, promptMessage, brainResponse, addResult);
}

async function accuseModelAnswer(mysteryName: string, promptMessage: string, userId: string, suspectToAccuse: string) {
	const response = await accuseModelRequest(suspectToAccuse, promptMessage);
	const ratingSet = await setRating(mysteryName, userId, response.rating);
	throwIfFalse(ratingSet, 'Could not set rating');
	const addResult = async (message: string) => {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
	};

	return letterModelRequest(mysteryName, [], promptMessage, response.epilogue, addResult);
}

async function getAnswer(mysteryName: string, promptMessage: string, userId: string, suspectToAccuse: string) {
	return suspectToAccuse
		? await accuseModelAnswer(mysteryName, promptMessage, userId, suspectToAccuse)
		: await standardInvestigationAnswer(mysteryName, promptMessage, userId);
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
		if (countTokens(message) > MAX_TOKENS) {
			throw error(400, 'Message is too long.');
		}
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

		return await getAnswer(game_config.mysteryName, message, session.user.id, suspectToAccuse);
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
