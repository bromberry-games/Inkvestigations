import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatMessage, type BaseMessage } from 'langchain/schema';

const systemTemplate = `
		We're playing a game. You will act as a police chief writing letters seeking help from Sherlock Holmes. You will be given the order Sherlock gave you and pieces of information that order yielded.
		Here's an example of what your letter should look like:
		""" 
		Dear Mr. Holmes,
		
		[relevant information]

		Sincerely,
		Chief Wellington
		"""

		Here is some initial information:

		"""
		{information}

		### Characters
        {victimName}: Victim. {victimDescription}
		{suspects}
		"""

		Your letters should be conversational. However, it is important you focus on the nformation without adding your opinions or suggestions.
	`;

const fewShotPromptLetter: BaseMessage[] = [
	new ChatMessage({
		role: 'user',
		content:
			'Order: interrogate the suspects\nInformation:\n- wife: morose and disturbed by what she saw\n\n- daughter: shocked and saddened by the news\n\n- son: mourns the loss of his hero and mentor\n\n- female colleague: struck but slightly unbothered\n\n- male colleague: very sad because the rivalry was purely professional\n\n- friend: sad but always suspected Terry might make enemies\n\n- mood: neutral'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"Dear Mr. Holmes,\n\nKaren King, his wife, appears deeply disturbed by something she witnessed. Olivia, his stepdaughter, is in shock and saddened by the news. Nathan, his son, mourns the loss of his hero and mentor. Dr. Lauren Chen seems struck but somewhat unbothered. Dr. Marcus Lee is very sad, citing that his rivalry with Mike was purely professional. And Adam Price, Mike's best friend, expresses sadness but also hints at the possibility of Terry making enemies.\n\nYours sincerely,\n\nWilliam Wellington\n\nPolice Chief of Zlockingbury"
	}),
	new ChatMessage({
		role: 'user',
		content: "Order: search the victim's garbage\nInformation:\n- it's full of trash\n\n- mood: bored"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'Mr. Holmes,\n\nIndeed...the rubbish bin was full of rubbish.\n\nYours sincerely,\n\nWilliam Wellington\n\nPolice Chief of Zlockingbury'
	})
];
const userTemplate = `Order: 
		{question}
		Information: 
		{brainInfo}
		mood: {mood}
	`;

export function createLetterPrompt(previousConversation: BaseMessage[]) {
	return ChatPromptTemplate.fromMessages([
		['system', systemTemplate],
		...fewShotPromptLetter,
		...previousConversation,
		['user', userTemplate]
	]);
}
