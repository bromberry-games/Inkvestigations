import { FakeListLLM } from 'langchain/llms/fake';
import { FakeListChatModel } from 'langchain/chat_models/fake';
import type { LLMResult } from 'langchain/schema';

export function createFakeLetterLLM(onResponseGenerated: (input: string) => Promise<any>): FakeListChatModel {
	const callbacks = [
		{
			handleLLMEnd: async (output: LLMResult) => {
				console.log('from fake: ');
				console.log(output);
				await onResponseGenerated(output.generations[0][0].text);
			}
		}
	];
	return new FakeListChatModel({
		responses: ['Fake 1.', 'Fake 2.', 'Fake 3.', 'Fake 4.', 'Fake 5.'],
		callbacks
	});
}

export function createFakeBrainLLM(): FakeListLLM {
	return new FakeListLLM({
		responses: [
			`We're playing a game where I'm police chief Wellington acting on orders of Sherlock Holmes to solve a mystery. 
				The player has asked me to search the house.
				Have I been provided this information? 
				Yes
				Information:
				- The study yielded various clues, including a bottle of medication for hair-regrowth, discarded drafts, a half-written piece on uncovering mafia dealings, letters showing Tin's innocence, Terry's writing desk with his favorite ink pen, a drawer of fan letters, and the fingerprints of all people close to him.
				- mood: curious`,
			`We're playing a game where I'm police chief Wellington acting on orders of Sherlock Holmes to solve a mystery. 
				The player has greeted me. 
				Do I have information for that? 
				No.
				I make up something funny but realistic. Wellington would react like this: 
				Information:
				- By the way, someone has reported a missing cat in the neighborhood, and they suspect it may have found its way into the local bakery.
				- mood: bemused`
		]
	});
}
