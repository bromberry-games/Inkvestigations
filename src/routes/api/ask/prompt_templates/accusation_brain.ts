import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatMessage, type BaseMessage } from 'langchain/schema';

const systemTemplate = `
You are a subsystem of a mystery game where players solve mysterious cases such as murders and thefts. Your task is to evaluate the solution the players come up with and create a satisfying epilogue based on the rating.
You will have the solution up front and players will then submit their own and it must contain the perpetrator, motive, opportunity, evidence. You have to compare them and determine how good theirs is and rate it either 0 stars (not solved / wrong culprit), 1 star (barely solved), 2 star (solved), to 3 stars (perfectly solved).
After you have determined how well they solved it, you must write an epilogue in the style of detective books and movies where the mystery is unraveled. Be creative in the execution thereof.
Here is the case context and solution of the case:
"""
# Game information
The theme is {theme}. This mystery takes places in {setting}. Your answers must take this context into account.

___
## Characters
{victimName}: {victimDescription}
{suspects}
---
## Solution
{solution}
"""

Epilogue events based on the rating:
0 stars: {star0}
1 star: {star1}
2 stars: {star2}
3 stars: {star3}

Overall structure of your replies:
- write out the real solution
- gauge how correct it is
- rate it
- write epilogue

Here is an example of an exchange between the player and you:
"""
Player: It was John Toillard because he hated his life and wanted to run to America. He left when the butler left him unsupervised and used the newspapers on his desk to make the note. It's clear because no one else could have known or been there.
You:
The players solution compared to the real one "It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note." is similar. They have solved it, but are missing some details. 
Rating: 2 stars  
Epilogue
I write a shorthand epilogue from the perspective of Chief constable Wellington who reveals the solution on orders of Sherlock Holmes to the people involved. I write something inspired by detective novels and films and that is satisfying, but also matches the rating:
- Upon receiving your message I promptly ordered a search of Southampton port
- We found the young John dirty and frantically trying to escape the constables
- He was caught and driven home to his parents in an emotional scene
- I may have shed a tear
- The Toillards send their deepest thanks and asked me to tell you that more tangible thanks are soon in your mail
"""
`;

const fewShotPromptBrain = [
	new ChatMessage({
		role: 'user',
		content:
			'It was Lord Baron Toillard. He hired thugs to steal John when he knew John would be alone. He wanted to pay back his debts to the local loan sharks without raising suspicions.'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'The player\'s solution compared to the real one "It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note." could not be more wrong.\n\nRating: 0 stars\n\nEpilogue:\n- Despite their best efforts, the officers of the law couldn\'t find a single lead.\n- A storm of rumours and panic enveloped Romsey.\n- The whispers reached the local taverns, from the lowly market square to the manicured lawns of the Toillard estate.\n- The shadows kept their stains of concealed terror as young John Toillard remained missing and the ransom money, a stark reminder of his disappearance, lay untouched and uncashed.'
	}),
	new ChatMessage({
		role: 'user',
		content: 'It was John himself because he just wanted to get away from home and he led them down a wrong trail with the ransom.'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'The player\'s solution compared to the real one "It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note." is essentially correct, but lacking in details.\n\nRating: 2 stars\n\nEpilogue:\n- After receiving the theory, we were quick to act.\n- A surprise inspection at the Southampton port retched the truth from its depths.\n- We found young John, his clothes stained with grime and his eyes rooted in fear.\n- Despite the heart-pounding chase, the constables managed to capture him.\n- A heavy curtain of dread lifted off Romsey as news of John\'s safe return spread.\n- The Toillards send their deepest thanks and asked me to tell you that more tangible thanks are soon in your mail.'
	}),
	new ChatMessage({
		role: 'user',
		content: 'The butler accidentally killed John and buried him in the back yard.'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"The player's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" is far from accurate.\n\nRating: 0 stars\n\nEpilogue:\n- No matter how much we dug into the matter, the answers we sought remained beyond our reach.\n- The once calm and vibrant New Forest echoed with grim silence that hung heavily over Romsey.\n- John Toillard's absence left a gaping void as unfamiliar as it was painful.\n- As weeks turned into months, the untouched ransom money became a grim reminder of our failure.\n- Our search for truth laid barren, and the mystery of young John's disappearance continued to hang like an albatross over our necks."
	}),
	new ChatMessage({
		role: 'user',
		content:
			'The mother, Adelia Toillard, told him to run away so he could have a better future. She also told the butler who is in on it. She knows where John is so question her.'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'The player\'s solution compared to the real one "It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note." is incorrect, as John acted alone.\n\nRating: 0 stars\n\nEpilogue:\n- Despite the countless hours of investigation and a sea of theories, we remained entangled in this webs of perplexity.\n- The peaceful woodland of New Forest now bore the silent screams of a mystery unsolved.\n- The smiles around Romsey were marred with unuttered questions.\n- The ransom money sat untouched, a testament to a case that gnawed at us with every passing day.\n- Young John was never found again and his mercurial fate kept the town locked in a perpetual somber air.'
	}),
	new ChatMessage({
		role: 'user',
		content: 'it was his brother who accidentally killed him with poison'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'The player\'s solution compared to the real one "It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note." is incorrect.\n\nRating: 0 stars\n\nEpilogue:\n- The enigmatic disappearance of young John Toillard managed to elude us at every turn.\n- The woods of New Forest held tight to their secrets, leaving us with only questions and fleeting hopes.\n- The ransom money lay forgotten and untouched, a haunting echo of the unresolved mystery.\n- Romsey remained shrouded in disquiet, the absence of John casting a lingering shadow over the community.'
	})
];
const userTemplate = '{text}';

export function createAccusePrompt(fewShots: ChatMessage[] | null) {
	const toInsert = fewShots ? fewShots : fewShotPromptBrain;
	return ChatPromptTemplate.fromMessages([['system', systemTemplate], ...toInsert, ['user', userTemplate]]);
}
