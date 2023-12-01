import { addInfoModelMessage, addMessageForUser, getBrainMessages, loadLetterMessages } from '$lib/supabase/conversations.server';
import { error } from '@sveltejs/kit';
import { brainModelRequest, letterModelRequest, type brainModelRequestParams } from './llangchain_ask';
import { throwIfFalse } from '$misc/error';
import { HumanMessage, type BaseMessage, AIMessage } from 'langchain/schema';
import { isPostgresError } from '$lib/supabase/helpers';

export async function standardInvestigationAnswer(
	brainParams: brainModelRequestParams,
	mysteryName: string,
	userId: string,
	letter_info: string
) {
	const brainMessages = await getBrainMessages(userId, mysteryName);
	if (isPostgresError(brainMessages)) {
		throw error(500, brainMessages.message);
	}
	const letterMessages = await loadLetterMessages(userId, mysteryName);
	if (!letterMessages) {
		throw error(500, 'Could not load letter messages');
	}

	const brainConversation: BaseMessage[] = [];
	brainMessages.forEach((item, index) => {
		brainConversation.push(
			new HumanMessage({
				content: letterMessages[index * 2].content
			})
		);
		brainConversation.push(
			new AIMessage({
				content: `${item.chainOfThought}
Information:
${item.info}
- mood: ${item.mood}`
			})
		);
	});

	const brainResponse = await brainModelRequest(brainParams, brainConversation);

	const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, brainResponse);
	throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');

	const assistantLetterAnswers = letterMessages.filter((m) => m.role === 'assistant');

	const messages: BaseMessage[] = [];
	for (let i = 0; i < assistantLetterAnswers.length; i++) {
		messages.push(
			new HumanMessage({
				content: 'Order:\n' + letterMessages[i].content + '\nInformation:\n' + brainMessages[i].info + '\n- mood: ' + brainMessages[i].mood
			})
		);
		messages.push(new AIMessage({ content: assistantLetterAnswers[i].content }));
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
