import { ChatPromptTemplate } from 'langchain/prompts';
import { ChatMessage, type BaseMessage } from 'langchain/schema';

const systemTemplate = `
The following part of the game is about the accusation. You will grade the player based on their accusation. An accusation must consist of motive, opportunity, and evidence. Your rating scale will be 3 stars.

## Solution
Here are the characters and solution to the mystery.

"""

{information}

"""

## Rating rules
0 stars: the player names any person except the true murderer.
1 star: the player names the murderer and the evidence correctly.
2 star: the player names the murderer, the evidence, and the motive correctly.
3 star: the player names the murderer, the evidence, the motive, and the opportunity correctly.

## Your behavior
After rating the answer, only provide the rating number as a header then write a cinematic accusation scene where the accused person is confronted as the body text. Based on the rating you've given, the scene unfolds successfully or unsuccessfully (i.e. 0 unsuccessful; 1 barely successful; 2 successful; 3 complete success). You never give away the true solution! You write nothing else.

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
