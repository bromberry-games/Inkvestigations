import { ChatOpenAI } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';
import { ChatMessage, type BaseMessage, type LLMResult } from 'langchain/schema';
import { BaseOutputParser } from '@langchain/core/output_parsers';
import { error } from '@sveltejs/kit';
import { OpenAiModel } from '$misc/openai';
import { createFakeBrainLLM, createFakeLetterLLM } from './fakes/fake_llm';
import { createBrainPrompt } from './prompt_templates/brain';
import { createLetterPrompt } from './prompt_templates/letter';
import { createAccusePrompt } from './prompt_templates/accusation_brain';
import { createAccuseLetterPrompt } from './prompt_templates/accusation_letter';
import { USE_FAKE_LLM } from '$env/static/private';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import type { Json } from '../../../schema';
import { CHAIN_OF_THOUGHT_TEXT } from './consts';

export interface Victim {
	name: string;
	description: string;
}

export interface LLMCallback {
	onResponseGenerated: (input: string) => Promise<void>;
}

export interface SuspectAndVictim {
	suspects: string;
	victim: Victim;
}

interface OpenAITokenParam {
	openAiToken: string;
}

interface ThemeAndSetting {
	theme: string;
	setting: string;
}

interface LetterModelRequestParams extends LLMCallback, SuspectAndVictim, OpenAITokenParam {
	gameInfo: string;
	previousConversation: BaseMessage[];
	question: string;
	brainAnswer: BrainOutput;
}

export interface BrainModelRequestParams extends SuspectAndVictim, ThemeAndSetting, OpenAITokenParam {
	question: string;
	eventClues: string;
	timeframe: { timeframe: string; event_happened: string }[];
	actionClues: { action: string; clue: string }[];
	fewShots: Json | null;
	eventTimeframe: string | null;
}

export interface AccuseModelRequestParams extends SuspectAndVictim, ThemeAndSetting, OpenAITokenParam {
	promptMessage: string;
	fewShots: Json | null;
	solution: string;
	starRatings: {
		star0: string;
		star1: string;
		star2: string;
		star3: string;
	};
}

interface AccuseLetterModelRequestParams extends LLMCallback, SuspectAndVictim, OpenAITokenParam {
	accusation: string;
	epilogue: string;
	accuseLetterInfo: string;
}

export async function letterModelRequest({
	gameInfo,
	previousConversation,
	question,
	brainAnswer,
	suspects,
	victim,
	onResponseGenerated,
	openAiToken
}: LetterModelRequestParams) {
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
			brainInfo: brainAnswer.info,
			victimName: victim.name,
			victimDescription: victim.description
		})
		.catch((e) => {
			console.error(e);
		});

	return new Response(stream, {
		headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }
	});
}

function createLetterModel(onResponseGenerated: (input: string) => Promise<any>, openAiToken: string) {
	const callbacks = [
		{
			handleLLMEnd: async (output: LLMResult) => {
				await onResponseGenerated(output.generations[0][0].text);
				//Delay for 3 secs
				// await new Promise((r) => setTimeout(r, 3000));
			},
			handleLLMError: async (error: Error) => {
				console.log('llm error: ', error);
			}
		}
	];
	return new ChatOpenAI({
		temperature: 0.6,
		modelName: OpenAiModel.Gpt35Turbo0125,
		openAIApiKey: openAiToken,
		maxTokens: 500,
		callbacks
	});
}

export interface BrainOutput {
	chainOfThought: string;
	info: string;
}

const INFO_REGEX = /([\s\S]*)Information:\s?([\s\S]*)(?:\s-)*/i;

class BrainParser extends BaseOutputParser<BrainOutput> {
	async parse(text: string): Promise<BrainOutput> {
		const infoMatch = text.match(INFO_REGEX);
		if (!infoMatch) {
			return {
				chainOfThought: CHAIN_OF_THOUGHT_TEXT,
				info: text
			};
		}
		return {
			chainOfThought: infoMatch[1],
			info: infoMatch[2]
		};
	}
}

function parseFewShots(fewShots: Json | null): ChatMessage[] | null {
	return fewShots?.messages.map((m) => {
		return new ChatMessage({
			role: m.role,
			content: m.content
		});
	});
}

export async function brainModelRequest(
	brainParams: BrainModelRequestParams,
	previousConversation: BaseMessage[],
	brainMessages: BrainOutput[]
): Promise<BrainOutput> {
	const timeframe =
		brainParams.timeframe.reduce((acc, curr) => {
			return acc + curr.timeframe + ': ' + curr.event_happened + '\n';
		}, '') + brainParams.eventTimeframe;
	const actionClues =
		brainParams.actionClues.reduce((acc, curr) => {
			return acc + curr.action + '--' + curr.clue + '\n';
		}, '') + brainParams.eventClues;

	let conversation = previousConversation;
	let oldInfo = '';
	if (conversation.length > 7) {
		conversation = conversation.slice(-6);
		oldInfo = brainMessages.slice(0, -3).reduce((acc, curr) => {
			return acc + curr.info.trim() + '\n';
		}, '');
	}
	const parsedFewShots = parseFewShots(brainParams.fewShots);
	const prompt = createBrainPrompt(conversation, parsedFewShots || []);
	const parser = new BrainParser();

	const llm =
		USE_FAKE_LLM == 'true'
			? createFakeBrainLLM()
			: new ChatOpenAI({
					temperature: 0.85,
					openAIApiKey: brainParams.openAiToken,
					modelName: OpenAiModel.Gpt35Turbo0125,
					maxTokens: 350
				});

	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: true });
	const res = await chain
		.call({
			theme: brainParams.theme,
			setting: brainParams.setting,
			text: brainParams.question,
			timeframe,
			actionClues,
			victimName: brainParams.victim.name,
			victimDescription: brainParams.victim.description,
			suspects: brainParams.suspects,
			oldInfo
		})
		.catch((e) => {
			console.error('brain model request', e);
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

export async function accuseBrainRequest({
	suspects,
	victim,
	solution,
	promptMessage,
	fewShots,
	theme,
	setting,
	openAiToken,
	starRatings
}: AccuseModelRequestParams): Promise<RatingWithEpilogue> {
	const prompt = createAccusePrompt(parseFewShots(fewShots));
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: openAiToken,
		modelName: OpenAiModel.Gpt35Turbo0125,
		maxTokens: 500
	});

	const parser = new RatingParser();
	const chain = new LLMChain({ prompt, llm, outputParser: parser, verbose: true });
	const res = await chain.call({
		text: promptMessage,
		suspects,
		victimName: victim.name,
		victimDescription: victim.description,
		theme,
		setting,
		solution,
		...starRatings
	});
	return res.text;
}

export async function accuseLetterModelRequest(accuseLetterParams: AccuseLetterModelRequestParams) {
	const prompt = createAccuseLetterPrompt();
	const llm = createLetterModel(accuseLetterParams.onResponseGenerated, accuseLetterParams.openAiToken);
	const parser = new HttpResponseOutputParser({
		contentType: 'text/event-stream'
	});
	const stream = await prompt
		.pipe(llm)
		.pipe(parser)
		.stream({
			information: accuseLetterParams.accuseLetterInfo,
			suspects: accuseLetterParams.suspects,
			accusation: accuseLetterParams.accusation,
			epilogue: accuseLetterParams.epilogue,
			victimName: accuseLetterParams.victim.name,
			victimDescription: accuseLetterParams.victim.description
		})
		.catch((e) => console.error(e));
	if (!stream) {
		error(500, 'Could not stream response');
	}

	return new Response(stream, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
}
