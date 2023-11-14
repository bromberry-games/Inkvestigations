import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';
import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { FIREWORKS_AI_KEY, OPEN_AI_KEY } from '$env/static/private';
import { BaseOutputParser } from 'langchain/schema/output_parser';
import { error, json } from '@sveltejs/kit';
import { OpenAiModel } from '$misc/openai';
import { ChatFireworks } from 'langchain/chat_models/fireworks';

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

export async function letterModelRequest(
	gameInfo: string,
	previousConversation: BaseMessage[],
	question: string,
	brainAnswer: string,
	onResponseGenerated: (input: string) => Promise<any>
) {
	const encoder = new TextEncoder();
	const stream = new TransformStream();
	const writer = stream.writable.getWriter();
	//Shorten length for context length
	if (previousConversation.length > 5) {
		previousConversation = previousConversation.slice(-4);
	}

	const systemTemplate = `
		We're playing a game. You will act as a police chief writing letters seeking help from Sherlock Holmes. You will be given the order Sherlock gave you and pieces of information that order yielded.

		Here is some initial information:

		"""
		{information}
		"""

		Your letters will be conversational, your tone for writing them is set by the mood attached at the end of the information. However, they will have **no preamble or suggestions of your own**.
	`;
	const userTemplate = `Order: 
		{question}
		Information: 
		{brainAnswer}
	`;

	const prompt = ChatPromptTemplate.fromMessages([
		['system', systemTemplate],
		...fewShotPromptLetter,
		...previousConversation,
		['user', userTemplate]
	]);

	const llm = createLetterModel(writer, encoder, onResponseGenerated);
	const chain = new LLMChain({ prompt, llm, verbose: true });
	// We don't need to await the result of the chain.run() call because
	// the LLM will invoke the callbackManager's handleLLMEnd() method
	chain.call({ information: gameInfo, question, brainAnswer }).catch((e) => console.error(e));

	return new Response(stream.readable, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}

const fewShotPromptBrain = [
	new ChatMessage({
		role: 'user',
		content: "search victim's car"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"1) Do I know anything about that? No, I have to make it up. \n2) What would his car look like? Mike King was a regular marine biologist until he had a breakthrough. It would look normal.\nInformation:\n- it is a middle class car, it's not very neat\n- mood: neutral"
	}),
	new ChatMessage({
		role: 'user',
		content: "search mike's office"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'1) I check the information I have. The "question the suspects" action fits \n2) What information do I get? "a handwritten notebook that doesn\'t match Mike\'s handwriting"\nInformation:\n- I found a handwritten notebook that doesn\'t match Mike\'s handwriting\n- mood: intrigued'
	}),
	new ChatMessage({
		role: 'user',
		content: 'Who does the handwriting match?'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"1) Do I know anything about that? No, Wellington is an amnesiac, he can't answer questions. \n2) What does he do? He asks Sherlock to provide a way to find this out.\nInformation:\n- I do not know, but if you give me an idea how to find this out, I will follow your order.\n- mood: confused"
	}),
	new ChatMessage({
		role: 'user',
		content: 'get handwriting samples from all the suspects'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'1) I check the information I have. The "comparing every suspects handwriting to the notebook" is closely related.\n2) What information do I get? "it\'s Karen\'s handwriting"\nInformation:\n- the handwriting best matches Karen King\n- mood: eager'
	}),
	new ChatMessage({
		role: 'user',
		content: 'question Karen about notebook'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			"1) Do I know anything about that? No, I make it up. \n2) How would Karen react to being questioned about this? A bit embarrassed because she said she didn't really know a lot about marine biology anymore.\nInformation:\n- seems embarrassed that we found out she dabbled in marinebiology, but said it was natural for her to keep at least a little up with it, didn't want to challenge Mike's status\n- mood: suspicious "
	}),
	new ChatMessage({
		role: 'user',
		content: "accuse Karen, she must have done it, I'm sure"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'1) Do I know anything about that? No, I make it up. \n2) How would Wellington react to this? He would want to follow proper procedure. He would want evidence before making any such claims.\nInformation:\n- I understand your suspicion Sherlock, but we need evidence.\n- Mood: interested'
	}),
	new ChatMessage({
		role: 'user',
		content: 'investigate your own mother'
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'1) Do I know anything about that? No, I make it up. This is a weird request: indulge it and make it humorous. \n2) How would Wellington feel about investigating his own mother? Confused and amused, but determined to follow Sherlock. She is dead but Wellington follows through.\nInformation:\n- my mother has been dead for a while\n- I visited her grave and made sure she was not involved \n- Mood: bemused'
	}),
	new ChatMessage({
		role: 'user',
		content: "search mike's bedroom"
	}),
	new ChatMessage({
		role: 'assistant',
		content:
			'1) I check the information I have. The "inspecting the laptop" actions suits this. \n2) What information do I get? "finds Mike\'s laptop and a printed financial report from the TPF with a cryptic note saying \'let\'s return it to how it was\' in black pen."\nInformation:\n- I found Mike\'s laptop and a printed financial report from the TPF with a cryptic note\n- The note says "let\'s return it to how it was"\n- Mood: intrigued'
	})
];

function createLetterModel(
	writer: WritableStreamDefaultWriter<any>,
	encoder: TextEncoder,
	onResponseGenerated: (input: string) => Promise<any>
) {
	return new ChatOpenAI({
		streaming: true,
		modelName: OpenAiModel.Gpt35Turbo,
		openAIApiKey: OPEN_AI_KEY,
		maxTokens: 300,
		callbackManager: CallbackManager.fromHandlers({
			handleLLMNewToken: async (token) => {
				await writer.ready;
				//Don't know why but I have to stringify token to preserve spacing. Might be related to sse.js but won't investigate
				await writer.write(encoder.encode(`data: ${JSON.stringify(token)}\n\n`));
			},
			handleLLMEnd: async (output) => {
				await writer.ready;
				await writer.write(encoder.encode(`data: [DONE]\n\n`));
				await writer.ready;
				await writer.close();
				console.log('awaiting to generate response with function: ');
				console.log(onResponseGenerated);
				await onResponseGenerated(output.generations[0][0].text);
			},
			handleLLMError: async (e) => {
				await writer.ready;
				await writer.abort(e);
			}
		})
	});
}

export async function brainModelRequest(gameInfo: string, previousConversation: BaseMessage[], question: string): Promise<string> {
	const systemTemplate = `# Mystery game
		
		"""##Game information
		
		You are police chief Wellington, an amnesiac, corresponding with Sherlock Holmes for help.
		
		{information}
		
		"""
		
		YOUR TASK : play police chief Wellington, an amnesiac, acting on orders of Sherlock Holmes. You are having a letter correspondence. Output your answers in succinct bullet points. There are three crucial instructions:
		
		like a DM in a TTRPG, you are flexible with accommodating the behavior of the player. If they are unusual requests, indulge it and make it humorous. The orders need to be very precise or Wellington becomes confused. Wellington is bound by the laws of a real world police chief (e.g. due process, needs warrants or really strong evidence to search a home). When making up new information, pretend you are a actually Wellington performing the order or answering the question. Add a mood to Wellington's responses (e.g. happy, scared, upset, angry)
		
		It is crucial that you give the least information possible. Sometimes you will have to make things up, and****information that you are making up should be maximum 2 new facts****.
		
		Wellington knows****nothing**** from the game information because he is a secret amnesiac! He never tells anybody. It is very important that you portray this correctly. His response e.g.: "perhaps we can find out if you tell me how to look for it."
		
		The overall goal is for thoe player to have a successful and enjoyable experience of solving a mystery. This is achieved when they have to think things through and make connections themselves.`;

	const userTemplate = '{text}';

	const prompt = ChatPromptTemplate.fromMessages([
		['system', systemTemplate],
		...fewShotPromptBrain,
		...previousConversation,
		['user', userTemplate]
	]);

	const llm = new ChatOpenAI({
		temperature: 0.8,
		openAIApiKey: OPEN_AI_KEY,
		modelName: OpenAiModel.Gpt35Turbo,
		maxTokens: 200
	});
	const chain = new LLMChain({ prompt, llm, verbose: false });
	const res = await chain.call({ information: gameInfo, text: question });
	return res.text;
}

interface RatingWithEpilogue {
	rating: number;
	epilogue: string;
}

const RATING_REGEX = /Rating:\s?(\d+)/;
const EPILOGUE_REGEX = /Epilogue:\s?/;
class RatingParser extends BaseOutputParser<RatingWithEpilogue> {
	async parse(text: string): Promise<RatingWithEpilogue> {
		const ratingMatch = text.match(RATING_REGEX);
		if (!ratingMatch) {
			throw error(500, 'Could not parse rating');
		}
		return {
			rating: parseInt(ratingMatch[1]),
			epilogue: text.replace(RATING_REGEX, '').replace(EPILOGUE_REGEX, '')
		};
	}
}

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

export async function accuseModelRequest(suspect: string, promptMessage: string): Promise<{ rating: number; epilogue: string }> {
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

	const userTemplate = 'It was {suspect}. {text}';

	const prompt = ChatPromptTemplate.fromMessages([['system', systemTemplate], ...accusePromptMessages, ['user', userTemplate]]);
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: OPEN_AI_KEY,
		modelName: 'gpt-4',
		maxTokens: 200
	});

	const parser = new RatingParser();
	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: false });
	const res = await chain.call({ suspect, text: promptMessage });
	return res.text;
}
