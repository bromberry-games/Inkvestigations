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

const fewShotPromptBrain = [
	new ChatMessage({
		role: 'user',
		content: "It was Oliver Smith because he was disappointed Terry's dramatics won over the truth!"
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?
		Yes.
		# Analysis
		I am analyzing the accusation for murderer, motive, opportunity, and evidence.
		Does****murderer**** match the accusation? -- Yes, the murderer is Oliver Smith.
		Is****motive**** correct? -- A little, Oliver was upset that Terry was interested more in drama. However, it does not paint the full picture.
		Is****opportunity**** correct? -- No, no opportunity was provided.
		Does****evidence**** match? -- No evidence was provided.
		What would be the success-rate of such an accusation be? It would definitely be unsuccessful because everyone knew Terry was like that. No evidence and no opportunity.
		# Rating: 0 Stars
		# Epilogue
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
		content: `# Analysis
		I am analyzing the accusation for murderer, motive, opportunity, and evidence.
		Does****murderer**** match the accusation? -- Yes, the murderer is Oliver Smith.
		Is****motive**** correct? -- "he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth."**Match very well.**
		Is****opportunity**** correct? -- "He placed it there on sunday and engineered it to take its time to dissolve" & "On Sunday, after sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye."**Match very well**
		Does****evidence**** match? -- "His second pen proves this as it still contains traces of the poison." & "The second pen in his home with traces of cyanide."**Match very well**
		What would be the success-rate of such an accusation be? It would definitely be successful.
		# Rating: 3 stars
		# Epilogue
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
		content: `Does this look like a real accusation?
		Yes.
		# Analysis
		I am analyzing the accusation for murderer, motive, opportunity, and evidence.
		Does****murderer**** match the accusation? -- Yes, the murderer is Oliver Smith.
		Is****motive**** correct? -- "his integrity for journalism soured his relationship with Terry who didn't care for it" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth."**Match very well.**
		Is****opportunity**** correct? -- No specific opportunity was mentioned.
		Does****evidence**** match? -- "The second pen in his home proves it." & "The second pen in his home with traces of cyanide."**Match very well**
		What would be the success-rate of such an accusation be? It would be slightly successful, as the motive and evidence match but opportunity is missing.
		# Rating: 2 stars
		# Epilogue
		What would happen to me, the chief, if I confronted the suspects like that? A rating of 2 means it is successful.
		- I called everyone to the crime scene, my voice filled with authority.
		- With a sense of confidence, I accused Oliver and everyone's heads shot to him, looking him up and down.
		- I explained his idolization collided with his internal moral compass and it led to a devious plan, poisoning him with cyanide.
		- Oliver blanched, but composed himself and asked when he was supposed to have had the opportunity to do this.
		- I said that I did not know (because you did not tell me Sherlock!), but I pulled out the second pen in a plastic bag.
		- I think everyone heard him swallow and they knew it was over.
		- He dropped his head and admitted everything. My boys took him away.
		- I did very well, I am proud!`
	}),
	new ChatMessage({
		role: 'user',
		content: 'It was olver, hje had apen with poison at hoime.'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?
		Yes.
		# Analysis
		I am analyzing the accusation for murderer, motive, opportunity, and evidence.
		Does****murderer**** match the accusation? -- Yes, the murderer is Oliver Smith.
		Is****motive**** correct? -- No motive was provided.
		Is****opportunity**** correct? -- No opportunity was provided.
		Does****evidence**** match? -- "he had a pen with poison at home" & "The second pen in his home with traces of cyanide."**Match very well.**
		What would be the success-rate of such an accusation be? It would be partially successful, as the evidence matches but motive and opportunity are missing.
		# Rating: 1 star
		# Epilogue
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
		content: 'oingo boingo'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?
		No.
		Is it humorous?
		No.
		# Letter from Wellington
		Dear Sherlock,
		I think you may have sent me the wrong letter by accident. I was expecting an accusation with****the murderer**, their**motive**,**opportunity**, and some**evidence****. I can't face the people without those.
		It's probably the post...how hard can it be to deliver a piece of paper.
		Eagerly awaiting closure,
		Wellington
		Police Chief`
	}),
	new ChatMessage({
		role: 'user',
		content: 'hi'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?

		No.

		Is it humorous?

		No.

		# Letter from Wellington

		Dear Sherlock,

		I think you may have sent me the wrong letter by accident. I was expecting an accusation with****the murderer**, their**motive**,**opportunity**, and some**evidence****. I can't face the people without those.

		It's probably the post...how hard can it be to deliver a piece of paper.

		Eagerly awaiting closure,

		Wellington

		Police Chief`
	}),
	new ChatMessage({
		role: 'user',
		content: 'good evening, it was your mother'
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?

		No.

		Is it humorous?

		Yes.

		# Letter from Wellington

		Dear Sherlock,

		I confronted my mother, but she chided me. She said: "What did I tell you? You always need****the murderer**, their**motive**,**opportunity**, and some**evidence****. You never listen!

		Eagerly awaiting closure,

		Wellington

		Police Chief`
	}),
	new ChatMessage({
		role: 'user',
		content: "i think it was the CIA, they're always up to something"
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?

		No.

		Is it humorous?

		Yes.

		# Letter from Wellington

		Dear Sherlock,

		I appreciate your enthusiasm, but we need a more concrete accusation. I am not brave enough as to accuse the CIA without any solid evidence. It leads to untimely departures from this plane... or so they say.

		Please provide the necessary details of****the murderer**, their**motive**,**opportunity**, and any**evidence**** you may have.

		Looking forward to your response,

		Wellington

		Police Chief`
	}),
	new ChatMessage({
		role: 'user',
		content:
			"It was Angela Videl because he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth. Terry's twisting of facts turned Olivers idolization into hatred and he decided to put an end to him by poisoning Terry with cyanide in his ink since he knew his habit of licking it. He placed it there on sunday and engineered it to take its time to dissolve. His second pen proves this as it still contains traces of the poison."
	}),
	new ChatMessage({
		role: 'assistant',
		content: `Does this look like a real accusation?

		Yes.

		# Analysis

		I am analyzing the accusation for murderer, motive, opportunity, and evidence.

		Does****murderer**** match the accusation? -- No, the accusation names Angela Videl as the murderer. It was someone else.

		Is****motive**** correct? -- "he was shaken to the core when he realized that Terry was chasing big, dramatic stories instead of the truth" & "Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth."**Match very well**.

		Is****opportunity**** correct? -- "He placed it there on sunday and engineered it to take its time to dissolve" & "On Sunday, after sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye."**Match very well**.

		Does****evidence**** match? -- "His second pen proves this as it still contains traces of the poison." & "The second pen in his home with traces of cyanide."**Match very well**.

		What would be the success-rate of such an accusation be? It would be unsuccessful, as the wrong person is accused.

		# Rating: 0 stars

		# Epilogue

		What would happen to me, the chief, if I confronted the suspects like that? A rating of 0 means it is unsuccessful.

		- I gathered the suspects at the crime scene, anticipation heavy in the air.

		- With conviction, I pointed my finger at Angela Videl, accusing her of the murder of Michael Terry.

		- Confusion and disbelief filled the room.

		- Angela vehemently denied any involvement, her voice trembling with anger and frustration.

		- I presented my motive, but she said she knew he was a drama queen and that's why they were rivals. That's why she did not work WITH him.

		- I presented the opportunity, but she said she did not sleep over at all!

		- I presented the evidence, but she asked me where I exactly got that pen from, which I couldn't answer.

		- She started crying and some of the others started consoling her.

		- I made an ass of myself, all thanks to you.`
	})
];

const userTemplate = 'It was {suspect}. {text}';

export function createAccusePrompt() {
	return ChatPromptTemplate.fromMessages([['system', systemTemplate], ...accusePromptMessages, ['user', userTemplate]]);
}
