import { addInfoModelMessage, addMessageForUser } from '$lib/supabase/conversations.server';
import { error } from '@sveltejs/kit';
import { brainModelRequest, letterModelRequest, type brainModelRequestParams, type BrainOutput } from './llangchain_ask';
import { throwIfFalse } from '$misc/error';
import { HumanMessage, type BaseMessage, AIMessage } from 'langchain/schema';
import type { ChatMessage as ChatMessageType } from '$misc/shared';

export async function standardInvestigationAnswer(
	brainParams: brainModelRequestParams,
	mysteryName: string,
	userId: string,
	letter_info: string,
	letterMessages: ChatMessageType[],
	brainMessages: BrainOutput[],
	genNum: number,
	openAiToken: string
) {
	let brainResponse: BrainOutput | undefined = undefined;
	if (genNum >= 0) {
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

		brainResponse = await brainModelRequest(brainParams, brainConversation, brainMessages, openAiToken);

		const addedInfoModelMessage = await addInfoModelMessage(userId, mysteryName, brainResponse);
		throwIfFalse(addedInfoModelMessage, 'Could not add info model message to chat');
	}

	if (!brainResponse) {
		brainResponse = brainMessages.pop();
	}
	if (!brainResponse) {
		error(500, 'brainResponse is empty');
	}

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

	return letterModelRequest(
		{
			gameInfo: letter_info,
			previousConversation: messages,
			question: brainParams.question,
			brainAnswer: brainResponse,
			suspects: brainParams.suspects,
			victim: brainParams.victim,
			onResponseGenerated: addResult
		},
		openAiToken
	);
}
