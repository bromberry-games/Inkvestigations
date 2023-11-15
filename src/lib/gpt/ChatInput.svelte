<script lang="ts">
	import type { ChatCompletionRequestMessage } from 'openai';
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';
	import { PaperAirplane } from '@inqling/svelte-icons/heroicon-24-solid';
	import type { ChatMessage } from '$misc/shared';
	import { eventSourceStore, isLoadingAnswerStore, liveAnswerStore, enhancedLiveAnswerStore } from '$misc/stores';
	import { countTokens } from '$misc/openai';
	import { Toast, Button } from 'flowbite-svelte';
	import SuspectModal from './SuspectModal.svelte';
	import { MAX_TOKENS } from '../../constants';

	const dispatch = createEventDispatcher();

	export let slug: string;
	export let messagesAmount: number;
	export let suspectToAccuse = '';
	export let suspects;

	let debounceTimer: number | undefined;
	let input = '';
	let inputCopy = '';
	let textarea: HTMLTextAreaElement;
	let messageTokens = 0;
	let lastUserMessage: string | null = null;
	let gameOver = false;

	$: message = input.trim();

	function handleSubmit() {
		messageTokens = countTokens(message);
		if (messageTokens > MAX_TOKENS || message.length === 0) return;

		if (suspectToAccuse) {
			gameOver = true;
		}
		isLoadingAnswerStore.set(true);
		inputCopy = input;

		lastUserMessage = message;

		const payload = {
			game_config: {
				suspectToAccuse: suspectToAccuse,
				mysteryName: slug.replace(/_/g, ' ')
			},
			message: message
		};

		$eventSourceStore.start(payload, handleAnswer, handleError, handleAbort);
		dispatch('chatInput', { role: 'user', content: message });
		input = '';
	}

	function handleAnswer(event: MessageEvent<any>) {
		try {
			// streaming...
			if (event.data !== '[DONE]') {
				//const completionResponse: any = JSON.parse(event.data);
				//const delta = completionResponse.token;
				const delta = JSON.parse(event.data);
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

		console.error(event);
		console.error(event.data);

		const data = JSON.parse(event.data);

		//TODO Show error toast

		if (data.message.includes('API key')) {
		}

		// restore last user prompt
		input = inputCopy;
	}

	function addCompletionToChat(isAborted = false) {
		const messageToAdd: ChatMessage = !isAborted ? { ...$liveAnswerStore } : { ...$enhancedLiveAnswerStore, isAborted: true };
		$isLoadingAnswerStore = false;
		$eventSourceStore.reset();
		resetLiveAnswer();
		lastUserMessage = null;
		dispatch('messageReceived', messageToAdd);
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

	let clickOutsideModal = false;
	let toastOpen = true;
	$: if (!toastOpen) {
		suspectToAccuse = '';
		toastOpen = true;
	}

	let placeholderText = 'Enter to send, Shift+Enter for newline';
	$: {
		if (gameOver) {
			placeholderText = 'Game Over';
		} else if (messagesAmount <= 0) {
			placeholderText = 'No messages';
		} else if (messagesAmount > 0) {
			placeholderText = 'Enter to send, Shift+Enter for newline';
		}
	}
</script>

<SuspectModal bind:clickOutsideModal bind:suspectToAccuse {suspects} {slug}></SuspectModal>
<footer class="fixed bottom-0 z-10 md:w-11/12 md:rounded-xl md:px-8 md:py-4">
	{#if $isLoadingAnswerStore}
		<div></div>
	{:else}
		<div class="flex flex-col space-y-2 px-2 md:mx-auto md:w-3/4 md:px-8 xl:w-1/2">
			<form on:submit|preventDefault={handleSubmit}>
				<div class="flex flex-wrap items-center">
					<!-- Input -->
					{#if suspectToAccuse}
						<Toast class="!md:p-3 w-full !max-w-md grow-0 md:mx-2 md:w-auto" bind:open={toastOpen}>Accuse: {suspectToAccuse}</Toast>
					{:else}
						<Button
							disabled={gameOver}
							class="mr-1 bg-secondary !p-2 font-primary text-xl text-quaternary md:mx-2 md:px-5"
							on:click={() => (clickOutsideModal = true)}>ACCUSE</Button
						>
					{/if}
					<textarea
						class="textarea min-h-[42px] flex-1 overflow-hidden font-secondary"
						rows="1"
						placeholder={placeholderText}
						use:textareaAutosizeAction
						on:keydown={handleKeyDown}
						bind:value={input}
						bind:this={textarea}
						disabled={gameOver || messagesAmount <= 0}
					/>
					<div
						data-testid="message-counter"
						aria-label="messages left counter"
						class="ml-1 h-full bg-[url('/images/message_counter.svg')] bg-cover bg-center bg-no-repeat px-4 py-6 font-tertiary text-xl md:ml-2"
					>
						{messagesAmount}
					</div>
					<div class="flex flex-col items-center justify-end md:flex-row md:items-end">
						<button type="submit" class="btn btn-sm ml-2">
							<PaperAirplane class="h-6 w-6" />
						</button>
					</div>
				</div>
			</form>
			{#if messageTokens > 50}
				<div class="text-center text-red-700">Input text too long</div>
			{/if}
		</div>
	{/if}
</footer>
