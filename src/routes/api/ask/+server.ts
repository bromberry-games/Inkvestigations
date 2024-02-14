import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getErrorMessage, throwIfFalse, throwIfUnset } from '$misc/error';
import type { Session } from '@supabase/supabase-js';
import {
	accuseLetterModelRequest,
	accuseBrainRequest,
	type AccuseModelRequestParams,
	type Victim,
	type SuspectAndVictim,
	type LLMCallback
} from './llangchain_ask';
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
import type { Json } from '../../../schema';
import { on } from 'events';

interface AccuseModelAnswerParams extends LLMCallback {
	mysteryName: string;
	userId: string;
	accuseLetterInfo: string;
	accuseBrainRequestParams: AccuseModelRequestParams;
}

export interface AskPayload {
	gameConfig: { accuse: boolean; mysteryName: string };
	regenerate: boolean;
	message: string;
	requestToken: string;
}

async function accuseModelAnswer({
	mysteryName,
	userId,
	accuseBrainRequestParams,
	accuseLetterInfo,
	onResponseGenerated
}: AccuseModelAnswerParams) {
	const response = await accuseBrainRequest(accuseBrainRequestParams);
	const ratingSet = await setRating(mysteryName, userId, response.rating);
	throwIfFalse(ratingSet, 'Could not set rating');
	return accuseLetterModelRequest({
		accusation: accuseBrainRequestParams.promptMessage,
		epilogue: response.epilogue,
		accuseLetterInfo: accuseLetterInfo,
		suspects: accuseBrainRequestParams.suspects,
		victim: accuseBrainRequestParams.victim,
		onResponseGenerated,
		openAiToken: accuseBrainRequestParams.openAiToken
	});
}

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		error(500, 'You are not logged in.');
	}
	const {
		gameConfig: { accuse, mysteryName },
		message,
		requestToken,
		regenerate
	}: AskPayload = await request.json();
	throwIfUnset('Mystery name', mysteryName);
	if ((textIsTooLong(accuse, approximateTokenCount(message)) || message.length == 0) && !regenerate) {
		error(400, 'Message is too long or empty');
	}

	const [letterMessages, brainMessages, messagesAmount, currentSub, gameInfo] = await Promise.all([
		loadLetterMessages(session.user.id, mysteryName),
		loadBrainMessages(session.user.id, mysteryName),
		getMessageAmountForUser(session.user.id),
		loadActiveAndUncancelledSubscription(session.user.id),
		loadGameInfo(mysteryName)
	]);
	isTAndThrowPostgresErrorIfNot(letterMessages);
	isTAndThrowPostgresErrorIfNot(brainMessages);
	isTAndThrowPostgresErrorIfNot(currentSub);
	isTAndThrowPostgresErrorIfNot(messagesAmount);
	isTAndThrowPostgresErrorIfNot(gameInfo);
	const genNum = letterMessages.length - brainMessages.length * 2;
	const useBackendToken = requestToken == undefined || requestToken == '';
	const openAiToken = useBackendToken ? OPEN_AI_KEY : requestToken;
	const hasNoMessages = messagesAmount.amount <= 0 && messagesAmount.non_refillable_amount <= 0;

	if (brainMessages.length > MAX_CONVERSATION_LENGTH && !accuse) {
		error(500, 'Too many messages. You have to accuse');
	}
	let messageToSend = message;
	if (genNum == 0 && regenerate && messageToSend == '') {
		error(500, 'nothing to regenerate');
	}

	if (hasNoMessages && genNum >= 0 && useBackendToken) {
		const meteredProd = currentSub.length == 1 ? currentSub[0].products.find((x) => x.metered_si != null) : undefined;
		if (meteredProd) {
			const prod = await stripeClient.products.retrieve(meteredProd.product_id);
			const usageRecord = await stripeClient.subscriptionItems.createUsageRecord(meteredProd.metered_si, {
				quantity: 1
			});
			const incMessages = await increaseMessageForUser(session.user.id, Number.parseInt(prod.metadata.metered_message_refill) - 1);
			if (isPostgresError(incMessages)) {
				//TODO reset usage record
				error(500, 'Could not increase messages Please contact us.');
			}
		} else {
			error(500, 'You have no messages.');
		}
	} else if ((!hasNoMessages || !useBackendToken) && genNum == 0) {
		const messageAdded = await addMessageForUser(session.user.id, message, mysteryName);
		throwIfFalse(messageAdded, 'Could not add message to chat');
		if (useBackendToken) {
			const decreasedMessageForUser = await decreaseMessageForUser(session.user.id);
			throwIfFalse(decreasedMessageForUser, 'Could not decrease message for user');
		}
	} else if (genNum == 1) {
		messageToSend = letterMessages[letterMessages.length - 1].content;
	}

	try {
		const eventClues = gameInfo.events
			.filter((event) => event.show_at_message <= brainMessages.length)
			.reduce((acc: string, event) => {
				return acc + event.info + '\n';
			}, '');
		const eventTimeframes = gameInfo.events.reduce((acc: string, event) => {
			return acc + event.timeframe + '\n';
		}, '');

		//Shuffle array so the murderer is not always the first suspect
		const suspectsString = shuffleArray([...gameInfo.suspects]).reduce((acc: string, suspect) => {
			return acc + suspect.name + ': ' + suspect.description + '\n';
		}, '');
		const suspectAndVictim: SuspectAndVictim = {
			suspects: suspectsString,
			victim: {
				name: gameInfo.victim_name,
				description: gameInfo.victim_description
			}
		};
		const themeAndSetting = {
			theme: gameInfo.theme,
			setting: gameInfo.setting
		};
		const userId = session.user.id;
		const addResult = async (message: string) => {
			const addedMessage = await addMessageForUser(userId, message, mysteryName);
			throwIfFalse(addedMessage, 'Could not add message to chat');
		};

		return accuse
			? await accuseModelAnswer({
					mysteryName,
					accuseBrainRequestParams: {
						...suspectAndVictim,
						...themeAndSetting,
						promptMessage: messageToSend,
						fewShots: gameInfo?.few_shots?.accuse_brain as Json,
						openAiToken,
						starRatings: gameInfo?.star_ratings as { star0: string; star1: string; star2: string; star3: string },
						solution: gameInfo.solution as string
					},
					userId,
					accuseLetterInfo: gameInfo.accuse_letter_prompt,
					onResponseGenerated: addResult
				})
			: await standardInvestigationAnswer(
					{
						...suspectAndVictim,
						...themeAndSetting,
						question: messageToSend,
						timeframe: gameInfo.timeframes,
						actionClues: gameInfo.action_clues,
						fewShots: gameInfo?.few_shots?.brain as Json,
						eventClues: eventClues,
						eventTimeframe: eventTimeframes,
						openAiToken
					},
					mysteryName,
					session.user.id,
					gameInfo.letter_prompt,
					letterMessages,
					brainMessages,
					genNum,
					{ onResponseGenerated: addResult }
				);
	} catch (err) {
		error(500, getErrorMessage(err));
	}
};
