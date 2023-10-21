<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import snarkdown from 'snarkdown';
	import { afterNavigate } from '$app/navigation';
	import type { Chat } from '$misc/shared';
	import { chatStore, enhancedLiveAnswerStore, isLoadingAnswerStore } from '$misc/stores';
	import ChatMessage from './ChatMessage.svelte';
	import { Spinner } from 'flowbite-svelte';

	export let slug: string;
	export let chat: Chat | undefined = undefined;

	$: if ($chatStore[slug]) {
		// If this is used in the "Shared chat" view, the chat is not in the local store.
		// Instead it's loaded from the db and passed in as a prop.
		chat = $chatStore[slug];
	}

	// Autoscroll: https://svelte.dev/tutorial/update
	let div: HTMLElement | null | undefined;
	let autoscroll: boolean | null | undefined;

	onMount(() => {
		// bind to the *scrollable* element by it's id
		// note: element is not exposed in this file, it lives in app.html
		div = document.getElementById('page');
		console.log(div);
	});

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div?.scrollTo({ top: div.scrollHeight, behavior: 'smooth' });
		window.scrollTo(0, document.body.scrollHeight);
	});

	afterNavigate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});
</script>

{#if chat}
	<div class="bg-quaternary">
		<div class="container mx-auto flex h-full flex-col px-4 md:px-8" style="justify-content: end">
			<slot name="additional-content-top" />

			<div class="flex max-w-4xl flex-col space-y-6 bg-tertiary pt-6 md:mx-auto">
				<!-- Message history -->
				<!-- Do not display the 1. message-->
				{#each chat.messages.slice(1) as message}
					<ChatMessage {slug} {message} />
				{/each}

				<!-- Live Message -->
				{#if $isLoadingAnswerStore}
					<div class="place-self-start">
						<div class="variant-ghost-tertiary rounded-2xl rounded-tl-none p-5">
							{@html snarkdown($enhancedLiveAnswerStore.content?.replace(/\n/g, '<br>'))}
						</div>
					</div>
				{/if}

				<slot name="additional-content-bottom" />

				<!-- Progress indicator -->
				<div class="animate-pulse self-center py-2 md:w-12 md:py-6" class:invisible={!$isLoadingAnswerStore}>
					<Spinner color="gray" />
				</div>
			</div>
		</div>
	</div>
{/if}
