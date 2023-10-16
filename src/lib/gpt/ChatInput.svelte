<script lang="ts">
	import type { ChatCompletionRequestMessage } from 'openai';
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';
	import { PaperAirplane, CircleStack } from '@inqling/svelte-icons/heroicon-24-solid';
	import type {
		ChatMessage,
	} from '$misc/shared';;
	import {
		chatStore,
		eventSourceStore,
		isLoadingAnswerStore,
		liveAnswerStore,
		enhancedLiveAnswerStore,
	} from '$misc/stores';
	import { countTokens } from '$misc/openai';
	import { Toast } from 'flowbite-svelte';

	const dispatch = createEventDispatcher();

	export let slug: string;
	export let messagesAmount: number;
	export let suspectToAccuse = '';

	let debounceTimer: number | undefined;
	let input = '';
	let inputCopy = '';
	let textarea: HTMLTextAreaElement;
	let messageTokens = 0;
	let lastUserMessage: ChatMessage | null = null;
	let currentMessages: ChatMessage[] | null = null;


	$: chat = $chatStore[slug];
	$: message = setMessage(input.trim());
	$: {
		if(chat.messages[0] == undefined) {
			message = setMessage(input.trim());
		}
	}

	function setMessage(content: string): ChatCompletionRequestMessage {
		return {
			role: 'user',
			content: content
		} as ChatCompletionRequestMessage;
	}
	

	const unsubscribe = chatStore.subscribe((chats) => {
		const chat = chats[slug];
		if (chat) {
			currentMessages = chat.messages;
		}
	});

	onDestroy(unsubscribe);

	function handleSubmit() {
		isLoadingAnswerStore.set(true);
		inputCopy = input;

		let parent: ChatMessage | null = null;
		if (currentMessages && currentMessages.length > 0) {
			parent = chatStore.getMessageById(currentMessages[currentMessages.length - 1].id!, chat);
		}

		chatStore.addMessageToChat(slug, message, parent || undefined);
		// message now has an id
		lastUserMessage = message;

		const payload = {
			// OpenAI API complains if we send additionale props
			game_config: {
				mode: 'accuse'	
			},
			messages: currentMessages?.map(
				(m) =>
					({
						role: m.role,
						content: m.content,
						name: m.name
					} as ChatCompletionRequestMessage)
			),
		};

		$eventSourceStore.start(payload, handleAnswer, handleError, handleAbort);
		dispatch('chatInput');
		input = '';
	}

	function handleAnswer(event: MessageEvent<any>) {
		try {
			// streaming...
			if (event.data !== '[DONE]') {
				// todo What's the correct type for this? It's not CreateChatCompletionResponse... maybe still missing in TypeDefs?
				const completionResponse: any = JSON.parse(event.data);
				const delta = completionResponse.choices[0].delta.content || '';
				liveAnswerStore.update((store) => {
					const answer = { ...store };
					answer.content += delta;
					return answer;
				});
			}
			// streaming completed
			else {
				addCompletionToChat();
			}
		} catch (err) {
			handleError(err);
		}
	}

	function handleAbort(_event: MessageEvent<any>) {
		// th message we're adding is incomplete, so HLJS probably can't highlight it correctly
		addCompletionToChat(true);
	}

	function handleError(event: any) {
		$eventSourceStore.reset();
		$isLoadingAnswerStore = false;

		// always true, check just for TypeScript
		if (lastUserMessage?.id) {
			chatStore.deleteMessage(slug, lastUserMessage.id);
		}

		console.error(event);

		const data = JSON.parse(event.data);

        //TODO Show error toast

		if (data.message.includes('API key')) {
		}

		// restore last user prompt
		input = inputCopy;
	}

	function addCompletionToChat(isAborted = false) {
		const messageToAdd: ChatMessage = !isAborted
			? { ...$liveAnswerStore }
			: { ...$enhancedLiveAnswerStore, isAborted: true };

		chatStore.addMessageToChat(slug, messageToAdd, lastUserMessage || undefined);
		$isLoadingAnswerStore = false;

		$eventSourceStore.reset();
		resetLiveAnswer();
		lastUserMessage = null;
	}

	function resetLiveAnswer() {
		liveAnswerStore.update((store) => {
			const answer = { ...store };
			answer.content = '';
			return answer;
		});
	}

	function handleKeyDown(event: KeyboardEvent) {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(calculateMessageTokens, 750);

		if ($isLoadingAnswerStore) {
			return;
		}

		if (event.key === 'Enter' && !event.shiftKey) {
			handleSubmit();
		}
	}

	function calculateMessageTokens() {
		messageTokens = countTokens(message);
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
</script>

<!-- <footer
	class="sticky space-y-4 bottom-0 z-10 py-2 md:py-4 md:px-8 md:rounded-xl"
> -->
<footer
	class="fixed bottom-0 z-10 py-2 md:py-4 md:px-8 md:rounded-xl w-full"
>
	{#if $isLoadingAnswerStore}
		<div class="flex items-center justify-center">
			<button class="btn variant-ghost w-48 self-center" on:click={() => $eventSourceStore.stop()}>
				Cancel generating
			</button>
		</div>
	{:else}
		<div class="flex flex-col space-y-2 md:mx-auto md:w-3/4 px-2 md:px-8">
			<div class="grid">
				{#if messagesAmount > 0}
				<form on:submit|preventDefault={handleSubmit}>
				<!-- <form use:focusTrap={!$isLoadingAnswerStore} on:submit|preventDefault={handleSubmit}> -->
					<div class="grid grid-cols-[1fr_auto]">
						<!-- Input -->
						<Toast>Accuse: </Toast>
						<textarea
							class="textarea overflow-hidden min-h-[42px]"
							rows="1"
							placeholder="Enter to send, Shift+Enter for newline"
							use:textareaAutosizeAction
							on:keydown={handleKeyDown}
							bind:value={input}
							bind:this={textarea}
						/>
						<div class="flex flex-col md:flex-row items-center justify-end md:items-end">
							<!-- Send button -->
							<button type="submit" class="btn btn-sm ml-2">
								<PaperAirplane class="w-6 h-6" />
							</button>
						</div>
					</div>
				</form>
				{:else}
				<div class="text-center">
					No more messages 
				</div>
				<div class="grid grid-cols-[1fr_auto]">
						<!-- Input -->
						<Toast>Accuse: </Toast>
						<textarea
							class="textarea overflow-hidden min-h-[42px]"
							rows="1"
							placeholder="No more messages left"
							disabled
						/>
						<div class="flex flex-col md:flex-row items-center justify-end md:items-end">
							<!-- Send button -->
							<button type="submit" class="btn btn-sm ml-2">
								<PaperAirplane class="w-6 h-6" />
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</footer>