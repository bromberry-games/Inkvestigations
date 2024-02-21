<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';
	import { PaperAirplane } from '@inqling/svelte-icons/heroicon-24-solid';
	import type { ChatMessage } from '$misc/shared';
	import {
		eventSourceStore,
		isLoadingAnswerStore,
		liveAnswerStore,
		enhancedLiveAnswerStore,
		tokenStore,
		messageAmountStore
	} from '$misc/stores';
	import { approximateTokenCount } from '$misc/openai';
	import { Button } from 'flowbite-svelte';
	import Timer from '../../routes/(navbar_only)/[slug]/timer.svelte';
	import { AuthStatus } from '$lib/auth-helper';
	import { textIsTooLong } from '$lib/message-conversation-lengths';
	import { isMobile } from '$lib/generic-helpers';
	import { invalidateAll } from '$app/navigation';
	import type { AskPayload } from '../../routes/api/ask/+server';

	const dispatch = createEventDispatcher();

	export let slug: string;
	export let chatUnbalanced: boolean;
	export let authStatus: AuthStatus;
	export let metered: boolean;
	export let blockWrite: boolean;
	export let gameOver = false;

	let accuseMode = false;
	let debounceTimer: number | undefined;
	let input = '';
	let inputCopy = '';
	let textarea: HTMLTextAreaElement;
	let messageTokens = 0;
	let lastUserMessage: string | null = null;
	// let gameOver = false;

	$: message = input.trim();
	$: if (blockWrite) {
		accuseMode = true;
	}

	function handleSubmit() {
		const messageTokens = approximateTokenCount(message);
		if (textIsTooLong(accuseMode, messageTokens) || message.length === 0) {
			console.log('input too long or empty ');
			return;
		}
		submitMessage(message);
		dispatch('chatInput', { role: 'user', content: message });
		input = '';
	}

	function handleRegenerate() {
		submitMessage(lastUserMessage ? lastUserMessage : '', true);
	}

	function submitMessage(messageToSubmit: string, regenerate = false) {
		if (accuseMode) {
			gameOver = true;
		}
		isLoadingAnswerStore.set(true);
		inputCopy = input;

		lastUserMessage = messageToSubmit;

		const payload: AskPayload = {
			gameConfig: {
				accuse: accuseMode,
				mysteryName: slug.replace(/_/g, ' ')
			},
			message: messageToSubmit,
			requestToken: $tokenStore,
			regenerate
		};

		$eventSourceStore.start(payload, handleAnswer, handleError, handleAbort, handleEnd);
	}

	function handleEnd(event: MessageEvent<any>) {
		addCompletionToChat();
	}

	function handleAnswer(event: MessageEvent<any>) {
		try {
			const delta = JSON.parse(event.data);
			liveAnswerStore.update((store) => {
				const answer = { ...store };
				answer.content += delta;
				return answer;
			});
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

		console.error('could not parse stream');
		console.error(event);
		console.error(event.data);

		const data = JSON.parse(event.data);

		//TODO Show error toast

		if (data.message.includes('API key')) {
			console.error('API key not found');
		}
		reloadPageAndSetInput();
	}

	async function reloadPageAndSetInput() {
		let tmp = inputCopy;
		await invalidateAll();
		input = tmp;
	}

	function addCompletionToChat(isAborted = false) {
		const messageToAdd: ChatMessage = !isAborted ? { ...$liveAnswerStore } : { ...$enhancedLiveAnswerStore, isAborted: true };
		$isLoadingAnswerStore = false;
		$eventSourceStore.reset();
		resetLiveAnswer();
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
		debounceTimer = window.setTimeout(calculateMessageTokens, 150);

		if ($isLoadingAnswerStore) {
			return;
		}

		if (!isMobile(navigator) && event.key === 'Enter' && !event.shiftKey) {
			handleSubmit();
		}
	}

	function calculateMessageTokens() {
		messageTokens = approximateTokenCount(message);
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}

	let placeholderText = '';
	$: {
		if (gameOver) {
			placeholderText = 'Game Over';
		} else if (!accuseMode) {
			placeholderText = 'Give instructions to the chief';
		} else {
			placeholderText = 'Input clues to solve the case';
		}
	}
</script>

<footer class="fixed bottom-0 z-10 w-full md:rounded-xl md:px-8 md:py-4">
	{#if $messageAmountStore > 0 || $tokenStore != '' || metered}
		{#if $isLoadingAnswerStore}
			<div></div>
		{:else if !chatUnbalanced}
			<div class="flex flex-col space-y-2 px-2 md:mx-auto md:w-3/4 md:px-8 xl:w-1/2">
				<form on:submit|preventDefault={handleSubmit}>
					<div class="flex flex-wrap items-center">
						<!-- Input -->
						<slot name="notes-button" />
						<button
							id="solve-button"
							type="button"
							class="btn btn-sm ml-2 border border-secondary bg-secondary p-2 font-primary text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
							disabled={blockWrite}
							on:click={() => {
								accuseMode = !accuseMode;
								messageTokens = 0;
								calculateMessageTokens();
							}}
						>
							{#if accuseMode}
								SOLVE
							{:else}
								WRITE
							{/if}
						</button>
						<textarea
							id="chat-input"
							data-testid="chat-input"
							class="textarea min-h-[42px] bg-amber-50 flex-1 overflow-hidden font-secondary border-primary focus:ring-primary focus:border-primary  {accuseMode ? 'shadow-inner shadow-red-500' : ''}"
							rows="1"
							placeholder={placeholderText}
							use:textareaAutosizeAction
							on:keydown={handleKeyDown}
							bind:value={input}
							bind:this={textarea}
							disabled={gameOver}
						/>
						<div class="flex flex-col items-center justify-end md:flex-row md:items-end">
							<button type="submit" class="btn btn-sm ml-2 text-quaternary" id="chat-submit">
								<PaperAirplane class="h-6 w-6" />
							</button>
						</div>
					</div>
				</form>
				{#if textIsTooLong(accuseMode, messageTokens)}
					<div class="text-center text-red-700">Input text too long</div>
				{/if}
			</div>
		{:else}
			<div class="flex justify-center">
				<Button class="bg-secondary !p-2 font-primary text-xl text-quaternary" on:click={handleRegenerate}>Regenerate</Button>
			</div>
		{/if}
	{:else if authStatus == AuthStatus.LoggedIn}
		<div class="flex justify-center">
			<Timer></Timer>
		</div>
	{:else}
		<div class="flex justify-center">
			<div>
				<p>No more free messages left.</p>
				<Button href="/login" class="bg-quaternary font-secondary text-2xl">Signup to continue</Button>
			</div>
		</div>
	{/if}
</footer>
