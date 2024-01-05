import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import type { BaseMessage, LLMResult } from 'langchain/schema';
import { OPEN_AI_KEY } from '$env/static/private';
import { BaseOutputParser, type FormatInstructionsOptions } from 'langchain/schema/output_parser';
import { error } from '@sveltejs/kit';
import { OpenAiModel } from '$misc/openai';
import { createFakeBrainLLM, createFakeLetterLLM } from './fakes/fake_llm';
import { createBrainPrompt } from './prompt_templates/brain';
import { createLetterPrompt } from './prompt_templates/letter';
import { createAccusePrompt } from './prompt_templates/accusation_brain';
import { createAccuseLetterPrompt } from './prompt_templates/accusation_letter';
import { USE_FAKE_LLM } from '$env/static/private';
import { HttpResponseOutputParser } from 'langchain/output_parsers';

interface LetterModelRequestParams {
	gameInfo: string;
	previousConversation: BaseMessage[];
	question: string;
	brainAnswer: BrainOutput;
	suspects: string;
	victim: Victim;
	onResponseGenerated: (input: string) => Promise<any>;
}

export interface Victim {
	name: string;
	description: string;
}

export async function letterModelRequest(
	{ gameInfo, previousConversation, question, brainAnswer, suspects, victim, onResponseGenerated }: LetterModelRequestParams,
	openAiToken: string
) {
	//Shorten length for context length
	if (previousConversation.length > 5) {
		previousConversation = previousConversation.slice(-4);
	}
	const prompt = createLetterPrompt(previousConversation);
	// const llm = createFakeLetterLLM(onResponseGenerated);
	const llm = createLetterModel(onResponseGenerated, openAiToken);
	const parser = new HttpResponseOutputParser({
		contentType: 'text/event-stream'
	});
	const chain = prompt.pipe(llm).pipe(parser);

	const stream = await chain
		.stream({
			information: gameInfo,
			suspects,
			question,
			mood: brainAnswer.mood,
			brainInfo: brainAnswer.info,
			victimName: victim.name,
			victimDescription: victim.description
		})
		.catch((e) => {
			console.error(e);
		});

	console.log('api token before stream: ' + openAiToken);
	return new Response(stream, {
		headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }
	});
}

function createLetterModel(onResponseGenerated: (input: string) => Promise<any>, openAiToken: string) {
	const callbacks = [
		{
			handleLLMEnd: async (output: LLMResult) => {
				await onResponseGenerated(output.generations[0][0].text);
			},
			handleLLMError: async (error: Error) => {
				console.log('llm error: ', error);
			}
		}
	];
	return new ChatOpenAI({
		modelName: OpenAiModel.Gpt35Turbo1106,
		openAIApiKey: openAiToken,
		maxTokens: 500,
		callbacks
	});
}

export interface BrainOutput {
	chainOfThought: string;
	info: string;
	mood: string;
}

const INFO_REGEX = /([\s\S]*)Information:\s?([\s\S]*)(?:\s-)*\smood:\s?(\w+)/i;

class BrainParser extends BaseOutputParser<BrainOutput> {
	async parse(text: string): Promise<BrainOutput> {
		const infoMatch = text.match(INFO_REGEX);
		if (!infoMatch) {
			error(500, 'Could not parse rating');
		}
		return {
			chainOfThought: infoMatch[1],
			info: infoMatch[2],
			mood: infoMatch[3]
		};
	}
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

export async function brainModelRequest(
	brainParams: brainModelRequestParams,
	previousConversation: BaseMessage[],
	brainMessages: BrainOutput[],
	openAiToken: string
): Promise<BrainOutput> {
	const timeframe = brainParams.timeframe.reduce((acc, curr) => {
		return acc + curr.timeframe + ': ' + curr.event_happened + '\n';
	}, '');
	const actionClues = brainParams.actionClues.reduce((acc, curr) => {
		return acc + curr.action + '--' + curr.clue + '\n';
	}, '');

	let conversation = previousConversation;
	let oldInfo = '';
	if (conversation.length > 7) {
		conversation = conversation.slice(-6);
		oldInfo = brainMessages.slice(0, -3).reduce((acc, curr) => {
			return acc + curr.info.trim() + '\n';
		}, '');
	}

	const prompt = createBrainPrompt(conversation);
	const parser = new BrainParser();

	const llm =
		USE_FAKE_LLM == 'true'
			? createFakeBrainLLM()
			: new ChatOpenAI({
					temperature: 0.8,
					openAIApiKey: openAiToken,
					modelName: OpenAiModel.Gpt35Turbo1106,
					maxTokens: 350
				});

	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: false });
	const res = await chain.call({
		theme: brainParams.theme,
		setting: brainParams.setting,
		text: brainParams.question,
		timeframe,
		actionClues,
		victimName: brainParams.victim.name,
		victimDescription: brainParams.victim.description,
		suspects: brainParams.suspects,
		oldInfo
	});
	return res.text;
}

interface RatingWithEpilogue {
	rating: number;
	epilogue: string;
}

const RATING_REGEX = /Rating:\s?(\d+)/i;
const EPILOGUE_REGEX = /Epilogue\s?([\s\S]*)/i;
class RatingParser extends BaseOutputParser<RatingWithEpilogue> {
	async parse(text: string): Promise<RatingWithEpilogue> {
		const ratingMatch = text.match(RATING_REGEX);
		if (!ratingMatch) {
			error(500, 'Could not parse rating');
		}
		const epilogueMatch = text.match(EPILOGUE_REGEX);
		if (!epilogueMatch) {
			error(500, 'Could not parse epilogue');
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

export async function accuseBrainRequest(
	{ suspects, victim, murderer, accusedSuspect, promptMessage }: AccuseModelRequestParams,
	openAiToken: string
): Promise<RatingWithEpilogue> {
	const prompt = createAccusePrompt();
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: openAiToken,
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
	accusedSuspect: string;
	onResponseGenerated: (input: string) => Promise<any>;
}

export async function accuseLetterModelRequest(
	{ accusation, epilogue, accuseLetterInfo, suspects, victim, accusedSuspect, onResponseGenerated }: AccuseLetterModelRequestParams,
	openAiToken: string
) {
	const prompt = createAccuseLetterPrompt();
	const llm = createLetterModel(onResponseGenerated, openAiToken);
	const parser = new HttpResponseOutputParser({
		contentType: 'text/event-stream'
	});
	const stream = await prompt
		.pipe(llm)
		.pipe(parser)
		.stream({
			information: accuseLetterInfo,
			suspects,
			accusation,
			epilogue,
			victimName: victim.name,
			victimDescription: victim.description,
			suspect: accusedSuspect
		})
		.catch((e) => console.error(e));
	if (!stream) {
		error(500, 'Could not stream response');
	}

	return new Response(stream, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}
