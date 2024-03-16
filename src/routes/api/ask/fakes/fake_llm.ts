import { FakeListChatModel } from '@langchain/core/utils/testing';
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

export function createFakeBrainLLM(): FakeListChatModel {
	return new FakeListChatModel({
		responses: ['Hello']
		// responses: [
		// `We're playing a game where I'm police chief Wellington acting on orders of Sherlock Holmes to solve a mystery.
		// The player has asked me to search the house.
		// Have I been provided this information?
		// Yes
		// Information:
		// - The study yielded various clues, including a bottle of medication for hair-regrowth, discarded drafts, a half-written piece on uncovering mafia dealings, letters showing Tin's innocence, Terry's writing desk with his favorite ink pen, a drawer of fan letters, and the fingerprints of all people close to him.
		// - mood: curious`,
		// `We're playing a game where I'm police chief Wellington acting on orders of Sherlock Holmes to solve a mystery.
		// The player has greeted me.
		// Do I have information for that?
		// No.
		// I make up something funny but realistic. Wellington would react like this:
		// Information:
		// - By the way, someone has reported a missing cat in the neighborhood, and they suspect it may have found its way into the local bakery.
		// - mood: bemused`
		// ]
	});
}

export function createFakeAccuseBrainLLM(): FakeListChatModel {
	return new FakeListChatModel({
		responses: [
			`The player's solution correctly identifies Oliver Smith as the murderer, provides the method of how the murder was committed, and captures the motive effectively.
			# Rating: 3 stars
			## Epilogue
			- With a sense of anticipation, I gather everyone in the grand hall, the tension palpable in the air.
			- I eloquently recount the twists and turns of the investigation, painting a vivid picture of the events that unfolded.
			- As I unveil the perpetrator, Oliver Smith, a collective gasp echoes through the room, and Oliver's expression shifts from defiance to guilt.
			- The atmosphere becomes charged as I detail how Oliver, fueled by his fanaticism for journalistic ethics, sought to avenge the betrayal he felt by Terry.
			- The room is gripped with a profound mix of shock and understanding as the pieces of the puzzle fall into place.
			- Oliver, confronted with the truth, breaks down, confessing to his heinous act and expressing remorse for his actions.
			- The revelation stirs a range of emotions among Terry's former colleagues, from disbelief to sorrow for the loss of a once-respected figure.
			- Angela Videl, in a poignant tribute to her late colleague, acknowledges the bittersweet resolution brought about by the dedication of the investigators.
			- The case is finally closed, with justice served and the truth of Terry's demise unveiled for all to see	
		`
		]
	});
}
