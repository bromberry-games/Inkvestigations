import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';
import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { OPEN_AI_KEY } from '$env/static/private';
import { BaseOutputParser } from 'langchain/schema/output_parser';
import { error, json } from '@sveltejs/kit';
import { OpenAiModel } from '$misc/openai';

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
	onResponseGenerated: (input: string) => void
) {
	console.log('letter model request');
	const encoder = new TextEncoder();
	const stream = new TransformStream();
	const writer = stream.writable.getWriter();
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

	const llm = new ChatOpenAI({
		streaming: true,
		modelName: OpenAiModel.Gpt35Turbo,
		openAIApiKey: OPEN_AI_KEY,
		callbackManager: CallbackManager.fromHandlers({
			handleLLMNewToken: async (token) => {
				await writer.ready;
				await writer.write(encoder.encode(`data: ${JSON.stringify(token)}\n\n`));
			},
			handleLLMEnd: async (output) => {
				await writer.ready;
				await writer.write(encoder.encode(`data: [DONE]\n\n`));
				await writer.ready;
				await writer.close();
				onResponseGenerated(output.generations[0][0].text);
			},
			handleLLMError: async (e) => {
				await writer.ready;
				await writer.abort(e);
			}
		})
	});
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
	console.log(res);
	return res.text;
	//return await chain.call({ information: gameInfo, text: question }).text;
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

export async function accuseModelRequest(messages: BaseMessage[]): Promise<{ rating: number; epilogue: string }> {
	const prompt = ChatPromptTemplate.fromMessages(messages);
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: OPEN_AI_KEY,
		modelName: 'gpt-4',
		maxTokens: 200
	});

	const parser = new RatingParser();
	const chain = prompt.pipe(llm).pipe(parser);

	return await chain.invoke({});
}
