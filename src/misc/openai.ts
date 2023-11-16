import type { ChatCompletionRequestMessage } from 'openai';
import type { Chat, ChatCost } from './shared';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { ChatStorekeeper } from './chatStorekeeper';

// Initialization is slow, so only do it once.
// TypeScript misinterprets the export default class GPT3Tokenizer from gpt3-tokenizer
// and throws "TypeError: GPT3Tokenizer is not a constructor" if we try to call the ctor here.
// Therefore, we initialize the tokenizer in the first call to countTokens().
let tokenizer: GPT3Tokenizer;

export enum OpenAiModel {
	Gpt35Turbo = 'gpt-3.5-turbo',
	Gpt35Turbo1106 = 'gpt-3.5-turbo-1106',
	Gpt4 = 'gpt-4',
	Gpt432k = 'gpt-4-32k',
	Gpt4Turbo = 'gpt-4-1106-preview	'
}

export interface OpenAiSettings {
	model: OpenAiModel;
	max_tokens: number; // just for completions
	temperature: number; // 0-2
	top_p: number; // 0-1
	stop?: string | string[]; // max 4 entries in array
}

export const defaultOpenAiSettings: OpenAiSettings = {
	model: OpenAiModel.Gpt4,
	max_tokens: 1024,
	temperature: 1,
	top_p: 1
};

export interface OpenAiModelStats {
	maxTokens: number; // total length (prompts + completion)
	// $ per 1k tokens, see https://openai.com/pricing:
	costPrompt: number;
	costCompletion: number;
}

export const models: { [key in OpenAiModel]: OpenAiModelStats } = {
	'gpt-3.5-turbo': {
		maxTokens: 4096,
		costPrompt: 0.002,
		costCompletion: 0.002
	},
	'gpt-4': {
		maxTokens: 8192,
		costPrompt: 0.03,
		costCompletion: 0.06
	},
	'gpt-4-32k': {
		maxTokens: 32768,
		costPrompt: 0.06,
		costCompletion: 0.12
	}
};
/**
 * see https://platform.openai.com/docs/guides/chat/introduction > Deep Dive Expander
 * see https://github.com/syonfox/GPT-3-Encoder/issues/2
 */
export function countTokens(message: string): number {
	// see comment above
	if (!tokenizer) {
		tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
	}
	return tokenizer.encode(message).text.length;

	//let num_tokens = 4; // every message follows <im_start>{role/name}\n{content}<im_end>\n
	//for (const [key, value] of Object.entries(message)) {
	//	if (key !== 'name' && key !== 'role' && key !== 'content') {
	//		continue;
	//	}
	//	const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(value);
	//	num_tokens += encoded.text.length;
	//	if (key === 'name') {
	//		num_tokens--; // if there's a name, the role is omitted
	//	}
	//}
}

export function estimateChatCost(chat: Chat): ChatCost {
	let tokensPrompt = 0;
	let tokensCompletion = 0;

	const messages = ChatStorekeeper.getCurrentMessageBranch(chat);

	for (const message of messages) {
		if (message.role === 'assistant') {
			tokensCompletion += countTokens(message);
		} else {
			// context counts as prompt (I think...)
			tokensPrompt += countTokens(message);
		}
	}

	// see https://platform.openai.com/docs/guides/chat/introduction > Deep Dive Expander
	const tokensTotal = tokensPrompt + tokensCompletion + 2; // every reply is primed with <im_start>assistant
	const { maxTokens, costPrompt: costPromptPer1k, costCompletion: costCompletionPer1k } = models['gpt-3.5-turbo'];
	const costPrompt = (costPromptPer1k / 1000.0) * tokensPrompt;
	const costCompletion = (costCompletionPer1k / 1000.0) * tokensCompletion;

	return {
		tokensPrompt,
		tokensCompletion,
		tokensTotal: tokensTotal,
		costPrompt,
		costCompletion,
		costTotal: costPrompt + costCompletion,
		maxTokensForModel: maxTokens
	};
}
