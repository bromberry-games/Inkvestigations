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
import { getMessageAmountForUser, decreaseMessageForUser, increaseMessageForUser } from '$lib/supabase/message_amounts.server';
import { approximateTokenCount } from '$misc/openai';
import { shuffleArray } from '$lib/generic-helpers';
import { standardInvestigationAnswer } from './conversation';
import { isPostgresError, isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import { OPEN_AI_KEY } from '$env/static/private';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server';
import { stripeClient } from '$lib/stripe';
import { MAX_CONVERSATION_LENGTH, textIsTooLong } from '$lib/message-conversation-lengths';

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
	const accuse: boolean = game_config.accuse;
	throwIfUnset('Mystery name', game_config.mysteryName);
	let message: string = requestData.message;
	throwIfUnset('messages', message);
	if (textIsTooLong(accuse, approximateTokenCount(message)) || message.length == 0) {
		error(400, 'Message is too long or empty');
	}

	const [letterMessages, brainMessages, messagesAmount, currentSub] = await Promise.all([
		loadLetterMessages(session.user.id, game_config.mysteryName),
		loadBrainMessages(session.user.id, game_config.mysteryName),
		getMessageAmountForUser(session.user.id),
		loadActiveAndUncancelledSubscription(session.user.id)
	]);
	isTAndThrowPostgresErrorIfNot(letterMessages);
	isTAndThrowPostgresErrorIfNot(brainMessages);
	isTAndThrowPostgresErrorIfNot(currentSub);
	const genNum = letterMessages.length - brainMessages.length * 2;
	const requestToken = requestData.openAiToken;
	const useBackendToken = requestToken == undefined || requestToken == '';
	const openAiToken = useBackendToken ? OPEN_AI_KEY : requestToken;

	if (brainMessages.length > MAX_CONVERSATION_LENGTH && !accuse) {
		error(500, 'Too many messages. You have to accuse');
	}

	if (messagesAmount.amount <= 0 && messagesAmount.non_refillable_amount <= 0 && genNum >= 0 && useBackendToken) {
		const meteredProd = currentSub.length == 1 ? currentSub[0].products.find((x) => x.metered_si != null) : undefined;
		if (meteredProd) {
			const prod = await stripeClient.products.retrieve(meteredProd.product_id);
			const usageRecord = await stripeClient.subscriptionItems.createUsageRecord(meteredProd.metered_si, {
				quantity: 1
			});
			const incMessages = await increaseMessageForUser(session.user.id, Number.parseInt(prod.metadata.metered_message_refill) - 1);
			if (isPostgresError(incMessages)) {
				//TODO reset usage record
				error(500, 'Could not increase messages for user');
			}
		} else {
			error(500, 'You have no messages.');
		}
	} else if ((messagesAmount.amount > 0 || messagesAmount.non_refillable_amount > 0 || !useBackendToken) && genNum == 0) {
		const messageAdded = await addMessageForUser(session.user.id, message, game_config.mysteryName);
		throwIfFalse(messageAdded, 'Could not add message to chat');
		if (useBackendToken) {
			const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
			throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');
		}
	} else if (genNum == 1) {
		message = letterMessages[letterMessages.length - 1].content;
	}

	try {
		const gameInfo = await loadGameInfo(game_config.mysteryName, brainMessages.length);
		isTAndThrowPostgresErrorIfNot(gameInfo);
		const eventClues = gameInfo.events.reduce((acc: string, event) => {
			return acc + event.info + '\n';
		}, '');
		const eventTimeframes = gameInfo.events.reduce((acc: string, event) => {
			return acc + event.timeframe + '\n';
		}, '');

		//Shuffle array so the murderer is not always the first suspect
		const suspectsString = shuffleArray([
			...gameInfo.suspects,
			{ name: gameInfo.murderer.name, description: gameInfo.murderer.description, imagepath: gameInfo.murderer.imagepath }
		]).reduce((acc: string, suspect) => {
			return acc + suspect.name + ': ' + suspect.description + '\n';
		}, '');

		const victim = {
			name: gameInfo.victim_name,
			description: gameInfo.victim_description
		};

		return accuse
			? await accuseModelAnswer(
					{
						mysteryName: game_config.mysteryName,
						accuseBrainRequestParams: {
							promptMessage: message,
							suspects: suspectsString,
							victim,
							murderer: {
								murdererName: gameInfo.murderer.name,
								motive: gameInfo.murderer.motive,
								opportunity: gameInfo.murderer.opportunity,
								evidence: gameInfo.murderer.evidence
							},
							fewShots: gameInfo?.few_shots?.accuse_brain
						},
						userId: session.user.id,
						accuseLetterInfo: gameInfo.accuse_letter_prompt
					},
					openAiToken
				)
			: await standardInvestigationAnswer(
					{
						suspects: suspectsString,
						victim: victim,
						question: message,
						theme: gameInfo.theme,
						setting: gameInfo.setting,
						timeframe: gameInfo.timeframes,
						actionClues: gameInfo.action_clues,
						fewShots: gameInfo?.few_shots?.brain,
						eventClues: eventClues,
						eventTimeframes
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
