import type { ChatCompletionRequestMessage } from 'openai';
import { writable, type Readable, type Writable, readable, derived } from 'svelte/store';
import { EventSource } from './eventSource';
import { closeOpenedCodeTicks } from './markdownHelper';

export const liveAnswerStore: Writable<ChatCompletionRequestMessage> = writable({
	role: 'assistant',
	content: ''
});

export const enhancedLiveAnswerStore = derived(liveAnswerStore, ($liveAnswer) => {
	if (!$liveAnswer?.content) {
		return $liveAnswer;
	}

	let { content } = $liveAnswer;
	content = closeOpenedCodeTicks(content);

	return {
		...$liveAnswer,
		content
	} as ChatCompletionRequestMessage;
});

export const isLoadingAnswerStore: Writable<boolean> = writable(false);

export const eventSourceStore: Readable<EventSource> = readable(new EventSource());

function createWritableStore<T>(key: string, startValue: T) {
	const { subscribe, set } = writable(startValue);

	return {
		subscribe,
		set,
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe((current) => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
}

export const tokenStore = createWritableStore('tokenStore', '');
