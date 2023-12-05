import GPT3Tokenizer from 'gpt3-tokenizer';

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
	Gpt4Turbo = 'gpt-4-1106-preview'
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
}
