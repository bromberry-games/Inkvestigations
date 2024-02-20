// import GPT3Tokenizer from 'gpt3-tokenizer';

// const encoder = encoding_for_model('gpt-3.5-turbo');
// Initialization is slow, so only do it once.
// TypeScript misinterprets the export default class GPT3Tokenizer from gpt3-tokenizer
// and throws "TypeError: GPT3Tokenizer is not a constructor" if we try to call the ctor here.
// Therefore, we initialize the tokenizer in the first call to countTokens().

export enum OpenAiModel {
	Gpt35Turbo = 'gpt-3.5-turbo',
	Gpt35Turbo1106 = 'gpt-3.5-turbo-1106',
	Gpt4 = 'gpt-4',
	Gpt432k = 'gpt-4-32k',
	Gpt4Turbo = 'gpt-4-1106-preview',
	Gpt35Turbo0125 = 'gpt-3.5-turbo-0125'
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

/**
 * see https://platform.openai.com/docs/guides/chat/introduction > Deep Dive Expander
 * see https://github.com/syonfox/GPT-3-Encoder/issues/2
 */

const oneOverE = 0.36787;
// This is probably good enough since a precise count is not needed https://stackoverflow.com/questions/76216113/how-can-i-count-tokens-before-making-api-call
export function approximateTokenCount(message: string): number {
	return message.length * oneOverE + 4;
}
