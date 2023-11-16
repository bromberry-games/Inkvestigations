import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import type { Session } from '@supabase/supabase-js';
import { accuseLetterModelRequest, accuseModelRequest, brainModelRequest as brainModelRequest, letterModelRequest } from './llangchain_ask';
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

async function standardInvestigationAnswer(
	mysteryName: string,
	promptMessage: string,
	userId: string,
	brainInfo: string,
	letter_info: string
) {
	const infoModelMessages = await getInfoModelMessages(userId, mysteryName);
	if (!infoModelMessages) {
		throw error(500, 'Could not get info model messages');
	}
	const brainResponse = await brainModelRequest(brainInfo, infoModelMessages, promptMessage);

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

	async function addResult(message: string) {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
	}

	return letterModelRequest(letter_info, messages, promptMessage, brainResponse, addResult);
}

async function accuseModelAnswer(
	mysteryName: string,
	promptMessage: string,
	userId: string,
	suspectToAccuse: string,
	accuseInfo: string,
	accuseLetterInfo: string
) {
	const response = await accuseModelRequest(suspectToAccuse, promptMessage, accuseInfo);
	const ratingSet = await setRating(mysteryName, userId, response.rating);
	throwIfFalse(ratingSet, 'Could not set rating');
	const addResult = async (message: string) => {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
		await archiveLastConversation(userId, mysteryName);
	};

	return accuseLetterModelRequest(accuseLetterInfo, promptMessage, response.epilogue, addResult);
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
		const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
		throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');
		const gameInfo = await loadGameInfo(game_config.mysteryName);
		if (!gameInfo) {
			throw error(500, 'Could not get game info');
		}

		return suspectToAccuse
			? await accuseModelAnswer(
					game_config.mysteryName,
					message,
					session.user.id,
					suspectToAccuse,
					gameInfo.accuse_prompt,
					gameInfo.accuse_letter_prompt
			  )
			: await standardInvestigationAnswer(game_config.mysteryName, message, session.user.id, gameInfo.brain_prompt, gameInfo.letter_prompt);
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
