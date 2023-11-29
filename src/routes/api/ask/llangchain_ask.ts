import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { CallbackManager } from 'langchain/callbacks';
import type { BaseMessage } from 'langchain/schema';
import { OPEN_AI_KEY } from '$env/static/private';
import { BaseOutputParser } from 'langchain/schema/output_parser';
import { error } from '@sveltejs/kit';
import { OpenAiModel } from '$misc/openai';
import { createFakeLLM } from './fake_llm';
import { createBrainPrompt } from './prompt_templates/brain';
import { createLetterPrompt } from './prompt_templates/letter';
import { createAccusePrompt } from './prompt_templates/accusation_brain';
import { createAccuseLetterPrompt } from './prompt_templates/accusation_letter';

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

	const prompt = createLetterPrompt(previousConversation);
	const llm = createLetterModel(writer, encoder, onResponseGenerated);
	const chain = new LLMChain({ prompt, llm, verbose: true });
	chain.call({ information: gameInfo, question, brainAnswer }).catch((e) => console.error(e));

	return new Response(stream.readable, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}

function createLetterModel(
	writer: WritableStreamDefaultWriter<any>,
	encoder: TextEncoder,
	onResponseGenerated: (input: string) => Promise<any>
) {
	const callbackManager = CallbackManager.fromHandlers({
		handleLLMNewToken: async (token) => {
			await writer.ready;
			//Don't know why but I have to stringify token to preserve spacing. Might be related to sse.js but won't investigate
			await writer.write(encoder.encode(`data: ${JSON.stringify(token)}\n\n`));
		},
		handleLLMEnd: async (output) => {
			await writer.ready;
			await writer.write(encoder.encode(`data: [DONE]\n\n`));
			await onResponseGenerated(output.generations[0][0].text);
			await writer.ready;
			await writer.close();
		},
		handleLLMError: async (e) => {
			await writer.ready;
			await writer.abort(e);
		}
	});
	return new ChatOpenAI({
		streaming: true,
		modelName: OpenAiModel.Gpt35Turbo,
		openAIApiKey: OPEN_AI_KEY,
		maxTokens: 300,
		callbackManager
	});
}

export async function brainModelRequest(gameInfo: string, previousConversation: BaseMessage[], question: string): Promise<string> {
	const prompt = createBrainPrompt(previousConversation);

	const llm = new ChatOpenAI({
		temperature: 0.8,
		openAIApiKey: OPEN_AI_KEY,
		modelName: OpenAiModel.Gpt35Turbo1106,
		maxTokens: 200
	});

	const chain = new LLMChain({ prompt, llm, verbose: true });
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

export async function accuseModelRequest(
	suspect: string,
	promptMessage: string,
	accuseInfo: string
): Promise<{ rating: number; epilogue: string }> {
	const prompt = createAccusePrompt();
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: OPEN_AI_KEY,
		modelName: 'gpt-4',
		maxTokens: 200
	});

	const parser = new RatingParser();
	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: false });
	const res = await chain.call({ information: accuseInfo, suspect, text: promptMessage });
	return res.text;
}

export async function accuseLetterModelRequest(
	accusation: string,
	epilogue: string,
	accuseLetterInfo: string,
	onResponseGenerated: (input: string) => Promise<any>
) {
	const encoder = new TextEncoder();
	const stream = new TransformStream();
	const writer = stream.writable.getWriter();

	const prompt = createAccuseLetterPrompt();
	const llm = createLetterModel(writer, encoder, onResponseGenerated);
	const chain = new LLMChain({ prompt, llm, verbose: true });
	chain.call({ information: accuseLetterInfo, accusation, epilogue }).catch((e) => console.error(e));

	return new Response(stream.readable, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}
