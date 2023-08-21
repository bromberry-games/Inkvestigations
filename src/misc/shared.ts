import type { ChatCompletionRequestMessage } from 'openai';
import type { OpenAiModel, OpenAiSettings } from './openai';
import { generateSlug } from 'random-word-slugs';

import { goto } from '$app/navigation';
import { chatStore, } from './stores';
import { get } from 'svelte/store';

export interface ChatMessage extends ChatCompletionRequestMessage {
	index?: number;
	id?: string;
	messages?: ChatMessage[];
	isSelected?: boolean;
	isAborted?: boolean;
}

export interface Chat {
	title: string;
	contextMessage: ChatCompletionRequestMessage;
	messages: ChatMessage[];
	created: Date;
	prompt: string;

	isImported?: boolean;
	updateToken?: string;
}

export interface ClientSettings {
	openAiApiKey?: string;
	hideLanguageHint?: boolean;
	useTitleSuggestions?: boolean;
	defaultModel?: OpenAiModel;
}

export interface ChatCost {
	tokensPrompt: number;
	tokensCompletion: number;
	tokensTotal: number;
	costPrompt: number;
	costCompletion: number;
	costTotal: number;
	maxTokensForModel: number;
}

export function createNewChat(template: {
	context?: string;
	title: string;
	prompt: string;
	settings?: OpenAiSettings;
	messages?: ChatCompletionRequestMessage[];
}) {
	const slug = template.title;
	const chat: Chat = {
		title: slug,
		contextMessage: {
			role: 'system',
			content: template?.context || ''
		},
		messages: template?.messages || [],
		created: new Date(),
		prompt: template.prompt
	};

	chatStore.updateChat(slug, chat);
	console.log(get(chatStore)[slug]);

	goto(`/${slug}`, { invalidateAll: true });
}
