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

interface LetterModelRequestParams {
	gameInfo: string;
	previousConversation: BaseMessage[];
	question: string;
	brainAnswer: string;
	suspects: string;
	victim: Victim;
	onResponseGenerated: (input: string) => Promise<any>;
}

export interface Victim {
	name: string;
	description: string;
}

export async function letterModelRequest({
	gameInfo,
	previousConversation,
	question,
	brainAnswer,
	suspects,
	victim,
	onResponseGenerated
}: LetterModelRequestParams) {
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
	chain
		.call({ information: gameInfo, suspects, question, brainAnswer, victimName: victim.name, victimDescription: victim.description })
		.catch((e) => console.error(e));

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
		modelName: OpenAiModel.Gpt35Turbo1106,
		openAIApiKey: OPEN_AI_KEY,
		maxTokens: 500,
		callbackManager
	});
}

export interface brainModelRequestParams {
	theme: string;
	setting: string;
	question: string;
	victim: Victim;
	suspects: string;
	timeframe: { timeframe: string; event_happened: string }[];
	actionClues: { action: string; clue: string }[];
}

export async function brainModelRequest(brainParams: brainModelRequestParams, previousConversation: BaseMessage[]): Promise<string> {
	const timeframe = brainParams.timeframe.reduce((acc, curr) => {
		return acc + curr.timeframe + ': ' + curr.event_happened + '\n';
	}, '');
	const actionClues = brainParams.actionClues.reduce((acc, curr) => {
		return acc + curr.action + '--' + curr.clue + '\n';
	}, '');
	const prompt = createBrainPrompt(previousConversation);

	const llm = new ChatOpenAI({
		temperature: 0.8,
		openAIApiKey: OPEN_AI_KEY,
		modelName: OpenAiModel.Gpt35Turbo1106,
		maxTokens: 200
	});

	const chain = new LLMChain({ prompt, llm, verbose: true });
	const res = await chain.call({
		theme: brainParams.theme,
		setting: brainParams.setting,
		text: brainParams.question,
		timeframe,
		actionClues,
		victimName: brainParams.victim.name,
		victimDescription: brainParams.victim.description,
		suspects: brainParams.suspects
	});
	return res.text;
}

interface RatingWithEpilogue {
	rating: number;
	epilogue: string;
}

const RATING_REGEX = /Rating:\s?(\d+)/;
const EPILOGUE_REGEX = /Epilogue\s?([\s\S]*)/;
class RatingParser extends BaseOutputParser<RatingWithEpilogue> {
	async parse(text: string): Promise<RatingWithEpilogue> {
		const ratingMatch = text.match(RATING_REGEX);
		if (!ratingMatch) {
			throw error(500, 'Could not parse rating');
		}
		const epilogueMatch = text.match(EPILOGUE_REGEX);
		if (!epilogueMatch) {
			throw error(500, 'Could not parse epilogue');
		}
		return {
			rating: parseInt(ratingMatch[1]),
			epilogue: epilogueMatch[1]
		};
	}
}

export interface Murderer {
	murdererName: string;
	motive: string;
	opportunity: string;
	evidence: string;
}

export interface AccuseModelRequestParams {
	suspects: string;
	victim: Victim;
	accusedSuspect: string;
	promptMessage: string;
	murderer: Murderer;
}

export async function accuseBrainRequest({
	suspects,
	victim,
	murderer,
	accusedSuspect,
	promptMessage
}: AccuseModelRequestParams): Promise<{ rating: number; epilogue: string }> {
	const prompt = createAccusePrompt();
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: OPEN_AI_KEY,
		modelName: OpenAiModel.Gpt35Turbo1106,
		maxTokens: 500
	});

	const parser = new RatingParser();
	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: true });
	const res = await chain.call({
		suspect: accusedSuspect,
		text: promptMessage,
		suspects,
		victimName: victim.name,
		victimDescription: victim.description,
		...murderer
	});
	return res.text;
}

interface AccuseLetterModelRequestParams {
	accusation: string;
	epilogue: string;
	accuseLetterInfo: string;
	suspects: string;
	victim: Victim;
	onResponseGenerated: (input: string) => Promise<any>;
}

export async function accuseLetterModelRequest({
	accusation,
	epilogue,
	accuseLetterInfo,
	suspects,
	victim,
	onResponseGenerated
}: AccuseLetterModelRequestParams) {
	const encoder = new TextEncoder();
	const stream = new TransformStream();
	const writer = stream.writable.getWriter();

	const prompt = createAccuseLetterPrompt();
	const llm = createLetterModel(writer, encoder, onResponseGenerated);
	const chain = new LLMChain({ prompt, llm, verbose: true });
	chain
		.call({ information: accuseLetterInfo, suspects, accusation, epilogue, victimName: victim.name, victimDescription: victim.description })
		.catch((e) => console.error(e));

	return new Response(stream.readable, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}
