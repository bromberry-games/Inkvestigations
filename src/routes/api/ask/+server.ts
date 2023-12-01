import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import type { Session } from '@supabase/supabase-js';
import {
	accuseLetterModelRequest,
	accuseBrainRequest,
	brainModelRequest as brainModelRequest,
	letterModelRequest,
	type AccuseModelRequestParams,
	type Victim,
	type brainModelRequestParams
} from './llangchain_ask';
import { AIMessage, BaseMessage, HumanMessage } from 'langchain/schema';
import { loadGameInfo } from '$lib/supabase/mystery_data.server';
import {
	addInfoModelMessage,
	addMessageForUser,
	archiveLastConversation,
	getBrainConversation,
	loadDisplayMessages,
	setRating
} from '$lib/supabase/conversations.server';
import { getMessageAmountForUser, decreaseMessageForUser } from '$lib/supabase/message_amounts.server';
import { countTokens } from '$misc/openai';
import { MAX_TOKENS } from '../../../constants';
import { shuffleArray } from '$lib/generic-helpers';

async function standardInvestigationAnswer(brainParams: brainModelRequestParams, mysteryName: string, userId: string, letter_info: string) {
	const brainConversation = await getBrainConversation(userId, mysteryName);
	if (!brainConversation) {
		throw error(500, 'Could not get info model messages');
	}
	const brainResponse = await brainModelRequest(brainParams, brainConversation);

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, brainResponse);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	const assistantLetterAnswers = (await loadDisplayMessages(userId, mysteryName))?.filter((m) => m.role === 'assistant');
	if (!assistantLetterAnswers) {
		throw error(500, 'Could not load backend messages');
	}

	const messages: BaseMessage[] = [];
	for (let i = 0; i < brainConversation.length; i += 2) {
		messages.push(
			new HumanMessage({
				content: 'Order:\n' + brainConversation[i].content + '\nInformation:\n' + brainConversation[i + 1].content
			})
		);
		messages.push(new AIMessage({ content: assistantLetterAnswers[i / 2].content }));
	}

	async function addResult(message: string) {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
	}

	return letterModelRequest({
		gameInfo: letter_info,
		previousConversation: messages,
		question: brainParams.question,
		brainAnswer: brainResponse,
		suspects: brainParams.suspects,
		victim: brainParams.victim,
		onResponseGenerated: addResult
	});
}

interface AccuseModelAnswerParams {
	mysteryName: string;
	userId: string;
	accuseLetterInfo: string;
	accuseBrainRequestParams: AccuseModelRequestParams;
}

async function accuseModelAnswer({ mysteryName, userId, accuseBrainRequestParams, accuseLetterInfo }: AccuseModelAnswerParams) {
	const response = await accuseBrainRequest(accuseBrainRequestParams);
	const ratingSet = await setRating(mysteryName, userId, response.rating);
	throwIfFalse(ratingSet, 'Could not set rating');
	const addResult = async (message: string) => {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
		await archiveLastConversation(userId, mysteryName);
	};
	return accuseLetterModelRequest({
		accusation: accuseBrainRequestParams.promptMessage,
		epilogue: response.epilogue,
		accuseLetterInfo: accuseLetterInfo,
		suspects: accuseBrainRequestParams.suspects,
		victim: accuseBrainRequestParams.victim,
		onResponseGenerated: addResult
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

		const suspectsArray = shuffleArray([
			...gameInfo.suspects,
			{ name: gameInfo.murderer.name, description: gameInfo.murderer.description, imagepath: gameInfo.murderer.imagepath }
		]);
		const suspectList = suspectsArray.reduce((acc: string, suspect) => {
			return acc + suspect.name + ': ' + suspect.description + '\n';
		}, '');

		const victim = {
			name: gameInfo.victim_name,
			description: gameInfo.victim_description
		};

		return suspectToAccuse
			? await accuseModelAnswer({
					mysteryName: game_config.mysteryName,
					accuseBrainRequestParams: {
						promptMessage: message,
						suspects: suspectList,
						accusedSuspect: suspectToAccuse,
						victim,
						murderer: {
							murdererName: gameInfo.murderer.name,
							motive: gameInfo.murderer.motive,
							opportunity: gameInfo.murderer.opportunity,
							evidence: gameInfo.murderer.evidence
						}
					},
					userId: session.user.id,
					accuseLetterInfo: gameInfo.accuse_letter_prompt
			  })
			: await standardInvestigationAnswer(
					{
						suspects: suspectList,
						victim: victim,
						question: message,
						theme: gameInfo.theme,
						setting: gameInfo.setting,
						timeframe: gameInfo.timeframe,
						actionClues: gameInfo.action_clues
					},
					game_config.mysteryName,
					session.user.id,
					gameInfo.letter_prompt
			  );
	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
