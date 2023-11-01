import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';
import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { OPEN_AI_KEY } from '$env/static/private';
import { BaseOutputParser } from 'langchain/schema/output_parser';
import { error } from '@sveltejs/kit';

const prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate('{input}')]);

async function llangRequest(req): Promise<Response> {
	try {
		const { input } = await req.json();
		// Check if the request is for a streaming response.
		const streaming = req.headers.get('accept') === 'text/event-stream';

		if (streaming) {
			// For a streaming response we need to use a TransformStream to
			// convert the LLM's callback-based API into a stream-based API.
			const encoder = new TextEncoder();
			const stream = new TransformStream();
			const writer = stream.writable.getWriter();

			const llm = new ChatOpenAI({
				streaming,
				callbackManager: CallbackManager.fromHandlers({
					handleLLMNewToken: async (token) => {
						await writer.ready;
						await writer.write(encoder.encode(`data: ${token}\n\n`));
					},
					handleLLMEnd: async () => {
						await writer.ready;
						await writer.close();
					},
					handleLLMError: async (e) => {
						await writer.ready;
						await writer.abort(e);
					}
				})
			});
			const chain = new LLMChain({ prompt, llm });
			// We don't need to await the result of the chain.run() call because
			// the LLM will invoke the callbackManager's handleLLMEnd() method
			chain.call({ input }).catch((e) => console.error(e));

			return new Response(stream.readable, {
				headers: { 'Content-Type': 'text/event-stream' }
			});
		} else {
			// For a non-streaming response we can just await the result of the
			// chain.run() call and return it.
			const llm = new ChatOpenAI();
			const chain = new LLMChain({ prompt, llm });
			const response = await chain.call({ input });

			return new Response(JSON.stringify(response), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (e) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function infoModelRequest(gameInfo: string): Promise<string> {
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

	const fewShotPrompts: BaseMessage[] = [
		new HumanMessage({
			content: 'interrogate the suspects'
		}),
		new AIMessage({
			content: `- wife: morose and disturbed by what she saw

				- daughter: shocked and saddened by the news

				- son: mourns the loss of his hero and mentor

				- female colleague: struck but slightly unbothered

				- male colleague: very sad because the rivalry was purely professional

				- friend: sad but always suspected Terry might make enemies

				- mood: neutral`
		}),
		new HumanMessage({
			content: "search victim's car"
		}),
		new AIMessage({
			content: `- it's very neglected and full of trash, among it are random notes
				- mood: eager
			`
		})
	];

	const userTemplate = '{text}';

	const prompt = ChatPromptTemplate.fromMessages([['system', systemTemplate], ...fewShotPrompts, ['user', userTemplate]]);

	const llm = new ChatOpenAI({
		temperature: 1.1,
		openAIApiKey: OPEN_AI_KEY,
		modelName: 'gpt-4',
		maxTokens: 200
	});
	return (await llm.predictMessages(messages)).content;
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
