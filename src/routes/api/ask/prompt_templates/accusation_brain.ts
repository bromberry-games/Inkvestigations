import { ChatPromptTemplate } from 'langchain/prompts';
import { ChatMessage, type BaseMessage } from 'langchain/schema';

const systemTemplate = `
You are system for rating accusations. You act as a cog in a larger machine. The machine is a mystery game where players are  solving cases as Sherlock Holmes. This part of the game is the accusation. The player will submit their deduction. You will grade that deduction. An accusation must consist of motive, opportunity, and evidence. Your rating scale will be 3 stars.
Here is an example of an accusation: 
"It was Oliver Smith. It was Oliver Smith because he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred and he decided to put an end to him by poisoning Terry with cyanide in his ink since he knew his habit of licking it. He placed it there on sunday and engineered it to take its time to dissolve. His second pen proves this as it still contains traces of the poison."
This is your format for answering:
"""
I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.

2) Is **motive** correct? -- "he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth." **Match very well.**

3) Is **opportunity** correct? -- "He placed it there on sunday and engineered it to take its time to dissolve" & "On Sunday, after sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye." **Match very well**

4) Does **evidence** match? -- "His second pen proves this as it still contains traces of the poison." & "The second pen in his home with traces of cyanide." **Match very well**

What would be the success-rate of such an accusation be? It would definitely be successful. 
#### Rating: 3 stars
#### Epilogue
What would happen to me, the chief, if I confronted the suspects like that? A rating of 3 is the best possible. 
- The room buzzed with anticipation as I pointed my finger at Oliver Smith, laying out his accusation with sharp precision.
- A hush fell when I revealed Oliver's disillusionment and the depths it pushed him to, a motive that shocked everyone in the room.
- An audible gasp filled the room when I detailed Oliver's calculated method of murder. The cyanide. The ink. Sunday. It all fit too well.
- Oliver’s pale face and violent protests only seemed to confirm my accusation even more.
- When I pulled the second pen from my coat, it landed like a bombshell, leaving no room for doubt.
- Shock rippled through everyone present at the magnitude of this revelation.
- I grinned. I am very smart!
"""


## Solution

Here are the characters and solution to the current mystery.

"""

### Characters
{victimName}: Victim. {victimDescription}
{suspects}

### Solution
**Murderer**: {murdererName}
**Motive**: {motive}
**Opportunity**: {opportunity}
**Evidence**: {evidence}

"""

## Rating rules
0 stars: the player does not name the true murderer
1 star: the player provides enough information so the murderer would confess.
2 star: the player names the murderer, the evidence, and the motive correctly.
3 star: the player names the murderer, the evidence, the motive, and the opportunity correctly.


Your task: analyze the accusation the player has provided. Then write bullet points for a potential epilogue scene. Based on the rating you've given, the scene unfolds successfully or unsuccessfully (i.e. 0 unsuccessful; 1 barely successful; 2 successful; 3 complete success). You never give away the true solution! You write nothing else.
You must always follow the provided format.
`;

const fewShotPromptBrain = [
	new ChatMessage({
		role: 'user',
		content: "It was Oliver Smith because he was disappointed Terry's dramatics won over the truth!"
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
		1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.
		2) Is **motive** correct? -- A little, Oliver was upset that Terry was interested more in drama. However, it does not paint the full picture.
		3) Is **opportunity** correct? -- No, no opportunity was provided.
		4) Does **evidence** match? -- No evidence was provided.
		What would be the success-rate of such an accusation be? It would definitely be unsuccessful because everyone knew Terry was like that. No evidence and no opportunity. 
		#### Rating: 0 Stars
		#### Epilogue
		What would happen to me, the chief, if I confronted the suspects like that? A rating of 0 is the worst possible. 
		- Spotlight shined on me, Wellington, as I gathered the suspects at the crime scene. 
		- I accused Oliver of murder out of disappointment towards Terry.
		- The room fell silent, my accusation hanging in the air, they were waiting for more.
		- Oliver, unfazed, retorted back, questioning the opportunity because Terry was alone for two days.
		- I came up empty handed.
		- He asked for any evidence, his voice ridiculing.
		- I proudly announced the fingerprints in the study!
		- Awkward silence pervaded the room as I was triumphantly gloating.
		- Bianca softly said "but everyone's fingerprints were there."
		- I face-palmed.
		- Uncomfortable shifting among suspects, eyes darting, some laughter, and doubt filling the room made me crimson red in the cheeks.
		- I realized: the accusation was a shot in the dark, Sherlock you embarrassed me!`
	}),
	new ChatMessage({
		role: 'user',
		content:
			"It was Oliver Smith because he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred and he decided to put an end to him by poisoning Terry with cyanide in his ink since he knew his habit of licking it. He placed it there on sunday and engineered it to take its time to dissolve. His second pen proves this as it still contains traces of the poison."
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
		1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.

		2) Is **motive** correct? -- "he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth." **Match very well.**

		3) Is **opportunity** correct? -- "He placed it there on sunday and engineered it to take its time to dissolve" & "On Sunday, after sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye." **Match very well**

		4) Does **evidence** match? -- "His second pen proves this as it still contains traces of the poison." & "The second pen in his home with traces of cyanide." **Match very well**

		What would be the success-rate of such an accusation be? It would definitely be successful. 
		#### Rating: 3 stars
		#### Epilogue
		What would happen to me, the chief, if I confronted the suspects like that? A rating of 3 is the best possible. 
		- The room buzzed with anticipation as I pointed my finger at Oliver Smith, laying out his accusation with sharp precision.
		- A hush fell when I revealed Oliver's disillusionment and the depths it pushed him to, a motive that shocked everyone in the room.
		- An audible gasp filled the room when I detailed Oliver's calculated method of murder. The cyanide. The ink. Sunday. It all fit too well.
		- Oliver’s pale face and violent protests only seemed to confirm my accusation even more.
		- When I pulled the second pen from my coat, it landed like a bombshell, leaving no room for doubt.
		- Shock rippled through everyone present at the magnitude of this revelation.
		- I grinned. I am very smart!`
	}),
	new ChatMessage({
		role: 'user',
		content:
			"It was Oliver Smith, his integrity for journalism soured his relationship with Terry who didn't care for it. The second pen in his home proves it."
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
		1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.

		2) Is **motive** correct? -- "his integrity for journalism soured his relationship with Terry who didn't care for it" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth." **Match very well.**

		3) Is **opportunity** correct? -- No specific opportunity was mentioned. 

		4) Does **evidence** match? -- "The second pen in his home proves it." & "The second pen in his home with traces of cyanide." **Match very well**

		What would be the success-rate of such an accusation be? It would be slightly successful, as the motive and evidence match but opportunity is missing.
		#### Rating: 2 stars
		#### Epilogue
		What would happen to me, the chief, if I confronted the suspects like that? A rating of 2 means it is successful. 
		- I called everyone to the crime scene, my voice filled with authority.
		- With a sense of confidence, I accused Oliver and everyone's heads shot to him, looking him up and down.
		- I explained his idolization collided with his internal moral compass and it led to a devious plan, poisoning him with cyanide.
		- Oliver blanched, but composed himself and asked when he was supposed to have had the opportunity to do this.
		- I said that I did not know (because you did not tell me Sherlock!), but I pulled out the second pen in a plastic bag.
		- I think everyone heard him swallow and they knew it was over.
		- He dropped his head and admitted everything. My boys took him away.
		- I did very well, I am proud!  `
	}),
	new ChatMessage({
		role: 'user',
		content: 'It was olver, hje had apen with poison at hoime.'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
		1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.
		2) Is **motive** correct? -- No motive was provided.
		3) Is **opportunity** correct? -- No opportunity was provided.
		4) Does **evidence** match? -- "he had a pen with poison at home" & "The second pen in his home with traces of cyanide." **Match very well.**
		What would be the success-rate of such an accusation be? It would be partially successful, as the evidence matches but motive and opportunity are missing.
		#### Rating: 1 star
		#### Epilogue
		What would happen to me, the chief, if I confronted the suspects like that? A rating of 1 means it is barely successful. 
		- I called everyone to the crime scene, my voice filled with authority.
		- With a sense of confidence, I accused Oliver and everyone's heads shot to him, looking him up and down.
		- I mentioned that Oliver had a pen with poison at home, and I held up the second pen as evidence.
		- The room grew quiet, awaiting further details about the motive and opportunity.
		- But I stumbled there, as I couldn't provide clear reasoning for his motives or opportunities.
		- Oliver, with a shaky smirk, denied the accusation, pointing out the lack of substantial evidence against him.
		- I realized that without providing a motive or opportunity, my accusation fell a bit short.
		- Embarrassed, I told my boys to book him. I told him, he can smirk at the jury, who will sort him out.`
	}),
	new ChatMessage({
		role: 'user',
		content: 'It was Oliver Smith oingo boingo'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
1) Does **murderer** match the accusation? -- Yes, the murderer is Oliver Smith.
2) Is **motive** correct? -- No, no motive was provided.
3) Is **opportunity** correct? -- No, no opportunity was provided.
4) Does **evidence** match? -- No evidence was provided.
What would be the success-rate of such an accusation be? It would definitely be unsuccessful because everyone knew Terry was like that. No evidence and no opportunity. 
#### Rating: 0 Stars
#### Epilogue
What would happen to me, the chief, if I confronted the suspects like that? A rating of 0 is the worst possible. 
- Spotlight shined on me, Wellington, as I gathered the suspects at the crime scene. 
- I accused Oliver because Terry hated Oingo Boingo.
- The room fell silent, my accusation hanging in the air, they were waiting for more.
- "The band?" someone asked, flabbergasted.
- Oliver, unfazed, retorted back, questioning the opportunity because Terry was alone for two days.
- I came up empty handed.
- He asked for any evidence, his voice ridiculing.
- I had nothing.
- Awkward silence pervaded the room, I fidgeted.
- Bianca softly said "I don't know that anyone is so passionate about Oingo Boing as to kill someone."
- I was not sure.
- Uncomfortable shifting among suspects, eyes darting, some laughter, and doubt filling the room made me crimson red in the cheeks.
- I realized: the accusation was a shot in the dark, Sherlock you embarrassed me!`
	}),
	new ChatMessage({
		role: 'user',
		content: 'It was Angela Videl.'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `I am a bot for analyzing the accusation from a player. They need murderer, motive, opportunity, and evidence.
1) Does **murderer** match the accusation? -- No, it was not Angela Videl.
2) Is **motive** correct? -- No, no motive was provided.
3) Is **opportunity** correct? -- No, no opportunity was provided.
4) Does **evidence** match? -- No evidence was provided.
What would be the success-rate of such an accusation be? It would definitely be unsuccessful because nothing is provided. 
#### Rating: 0 Stars
#### Epilogue
What would happen to me, the chief, if I confronted the suspects like that? A rating of 0 is the worst possible. 
- I entered the crime scene guns blazing, metaphorically. 
- I was smoking a cigar as I nonchalantly pointed at Angela Videl.
- "It was you," I said.
- All their looks shot at Videl, whose face twisted into shock.
- "How dare you," she shouted. "I would never." 
- Suddenly, her anger turned into big tears. Bianca started consoling her. 
- Bianca retorted, questioning the motive.
- I said their rivalry was the root.
- They called it preposterous. 
- What of opportunity and evidence they cried.
- I realized at that point you forgot to tell me that.
- They all left escorting the crying Videl. O'Ranner put his hand on my shoulder as he was leaving: "That was awful."
- Sherlock you embarrassed me!	
		`
	})
];

const userTemplate = '{text}';

export function createAccusePrompt(fewShots: ChatMessage[] | null) {
	const toInsert = fewShots ? fewShots : fewShotPromptBrain;
	return ChatPromptTemplate.fromMessages([['system', systemTemplate], ...toInsert, ['user', userTemplate]]);
}
