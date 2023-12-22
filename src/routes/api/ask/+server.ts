import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import type { Session } from '@supabase/supabase-js';
import { accuseLetterModelRequest, accuseBrainRequest, type AccuseModelRequestParams } from './llangchain_ask';
import { loadGameInfo } from '$lib/supabase/mystery_data.server';
import {
	addMessageForUser,
	archiveLastConversation,
	loadBrainMessages,
	loadLetterMessages,
	setRating
} from '$lib/supabase/conversations.server';
import { getMessageAmountForUser, decreaseMessageForUser } from '$lib/supabase/message_amounts.server';
import { approximateTokenCount } from '$misc/openai';
import { MAX_TOKENS } from '../../../constants';
import { shuffleArray } from '$lib/generic-helpers';
import { standardInvestigationAnswer } from './conversation';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import { OPEN_AI_KEY } from '$env/static/private';

interface AccuseModelAnswerParams {
	mysteryName: string;
	userId: string;
	accuseLetterInfo: string;
	accuseBrainRequestParams: AccuseModelRequestParams;
}

async function accuseModelAnswer(
	{ mysteryName, userId, accuseBrainRequestParams, accuseLetterInfo }: AccuseModelAnswerParams,
	openAiToken: string
) {
	const response = await accuseBrainRequest(accuseBrainRequestParams, openAiToken);
	const ratingSet = await setRating(mysteryName, userId, response.rating);
	throwIfFalse(ratingSet, 'Could not set rating');
	const addResult = async (message: string) => {
		const addedMessage = await addMessageForUser(userId, message, mysteryName);
		throwIfFalse(addedMessage, 'Could not add message to chat');
		await archiveLastConversation(userId, mysteryName);
	};
	return accuseLetterModelRequest(
		{
			accusation: accuseBrainRequestParams.promptMessage,
			epilogue: response.epilogue,
			accuseLetterInfo: accuseLetterInfo,
			suspects: accuseBrainRequestParams.suspects,
			victim: accuseBrainRequestParams.victim,
			accusedSuspect: accuseBrainRequestParams.accusedSuspect,
			onResponseGenerated: addResult
		},
		openAiToken
	);
}

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		error(500, 'You are not logged in.');
	}
	const requestData = await request.json();
	throwIfUnset('request data', requestData);
	const game_config = requestData.game_config;
	throwIfUnset('game_config', game_config);
	const suspectToAccuse = game_config.suspectToAccuse ? game_config.suspectToAccuse : '';
	throwIfUnset('Mystery name', game_config.mysteryName);
	let message: string = requestData.message;
	throwIfUnset('messages', message);
	if (approximateTokenCount(message) > MAX_TOKENS) {
		error(400, 'Message is too long.');
	}

	const [letterMessages, brainMessages, messagesAmount] = await Promise.all([
		loadLetterMessages(session.user.id, game_config.mysteryName),
		loadBrainMessages(session.user.id, game_config.mysteryName),
		getMessageAmountForUser(session.user.id)
	]);
	isTAndThrowPostgresErrorIfNot(letterMessages);
	isTAndThrowPostgresErrorIfNot(brainMessages);
	const genNum = letterMessages.length - brainMessages.length * 2;
	const requestToken = requestData.openAiToken;
	const openAiToken = requestToken == undefined || requestToken == '' ? OPEN_AI_KEY : requestToken;

	if (messagesAmount <= 0 && genNum >= 0) {
		error(500, 'You have no messages.');
	} else if (messagesAmount > 0 && genNum == 0) {
		const messageAdded = await addMessageForUser(session.user.id, message, game_config.mysteryName);
		throwIfFalse(messageAdded, 'Could not add message to chat');
		if (requestToken == undefined || requestToken == '') {
			const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
			throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');
		}
	} else if (genNum == 1) {
		message = letterMessages[letterMessages.length - 1].content;
	}

	try {
		const gameInfo = await loadGameInfo(game_config.mysteryName);
		if (!gameInfo) {
			error(500, 'Could not get game info');
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
			? await accuseModelAnswer(
					{
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
					},
					openAiToken
				)
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
					gameInfo.letter_prompt,
					letterMessages,
					brainMessages,
					genNum,
					openAiToken
				);
	} catch (err) {
		error(500, getErrorMessage(err));
	}
};
