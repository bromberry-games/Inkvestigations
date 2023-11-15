import { ChatPromptTemplate } from 'langchain/prompts';
import { ChatMessage, type BaseMessage } from 'langchain/schema';

const systemTemplate = `
		# Mystery Game Rating
		"""
		## Characters
		Michael Terry: Victim. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing.
		Bianca White: Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now. 
		Dexter Tin:Politician disgraced by Terry. 
		Oliver Smith: Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism. 
		Maria Payton: Long-time maid. 
		Angela Videl: Rival columnist. Peter 
		O'Ranner: Retired detective who helped with articles sometimes.
		## Solution
		Here is the solution to the mystery.
		**Murderer**: Oliver Smith
		**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.
		**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.
		**Evidence**: The second pen in his home with traces of cyanide."""
		## Rating rules
		0 stars: the player names any person except Oliver Smith.
		## Your behavior
		You task is to rate the deduction of a player from 0 to 3 stars. They will say who it was and provide reasons. It is very important that your rating is accurate. Based on the rating you've given, write bullet points of a dramatic and humorous scene that unfolds as the police chief Wellington makes his accusation on the orders of Sherlock Holmes. You never give away the true solution! You write nothing else. 	
	`;
const accusePromptMessages: BaseMessage[] = [
	new ChatMessage({
		role: 'user',
		content: "It was Oliver Smith because he was disappointed Terry's dramatics won over the truth!"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"Rating: 0 stars\nEpilogue:\n- Spotlight on Wellington as he accuses Oliver of murder out of disappointment towards Terry.\n- Room falls silent, accusation hangs in the air.\n- Oliver, unfazed, retorts back, questioning the evidence, leaving Wellington’s accusation hanging by a thread.\n- Wellington proudly announces the fingerprints in the study!\n- Awkward silence pervades the room, accusation falls flat.\n- Bianca softly says \"but everyone's fingerprints were there.\n- Uncomfortable shifting among characters, eyes darting, doubt filling the room.\n- Outside storm mirrors the internal turmoil, truth remains elusive.\n- Wellington’s realization: accusation was a shot in the dark, truth slips through leaving a room filled with lingering doubts and a tinge of humor at the detective's hasty conclusion"
	}),
	new ChatMessage({
		role: 'user',
		content:
			"It was Oliver Smith because he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred and he decided to put an end to him by poisoning Terry with cyanide in his ink since he knew his habit of licking it. He placed it there on sunday and engineered it to take its time to dissolve. His second pen proves this as it still contains traces of the poison."
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"Rating: 3 stars\nEpilogue:\n- The room buzzes with anticipation as Wellington points a finger at Oliver Smith, laying out his accusation with sharp precision.\n- A hush falls when Wellington reveals Oliver's disillusionment and the depths it pushed him to, a motive that shocks everyone in the room.\n- An audible gasp fills the room when Wellington details Oliver's calculated method of murder. The cyanide. The ink. Sunday. It all fits too well. \n- Oliver’s pale face and violent protests only seem to confirm Wellington’s accusation even more.\n- Wellington's reveal of cyanide on the second pen lands like a bombshell, leaving no room for doubt.\n- Shock ripples through everyone present at the magnitude of this revelation.\n- Wellington sit back, satisfied with his work, leaving everyone else scrambling to understand what just happened."
	})
];

const userTemplate = 'It was {suspect}. {text}';

export function createAccusePrompt() {
	return ChatPromptTemplate.fromMessages([['system', systemTemplate], ...accusePromptMessages, ['user', userTemplate]]);
}
