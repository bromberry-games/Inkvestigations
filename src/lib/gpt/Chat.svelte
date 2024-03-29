<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import snarkdown from 'snarkdown';
	import { afterNavigate } from '$app/navigation';
	import type { ChatMessage } from '$misc/shared';
	import { enhancedLiveAnswerStore, isLoadingAnswerStore } from '$misc/stores';
	import ChatMessageUI from './ChatMessageUI.svelte';
	import { Spinner } from 'flowbite-svelte';

	export let messages: ChatMessage[];
	let animMessages: ChatMessage[] = [];
	$: animMessages = messages;

	// Autoscroll: https://svelte.dev/tutorial/update
	let div: HTMLElement | null | undefined;
	let autoscroll: boolean | null | undefined;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div?.scrollTo({ top: div.scrollHeight, behavior: 'smooth' });
		window.scrollTo(0, document.body.scrollHeight);
	});

	afterNavigate(() => {
		if (messages.length > 1) window.scrollTo(0, document.body.scrollHeight);
	});

	onMount(() => {
		animMessages = messages;
	});
</script>

{#if animMessages && animMessages.length > 0}
	<div class="bg-quaternary">
		<slot name="additional-content-top" />
		<div class="container mx-auto flex h-full flex-col px-4 md:px-8" style="justify-content: end">
			<div class="bg-tertiary-400 flex max-w-4xl flex-col space-y-6 pt-6 md:mx-auto">
				<!-- Message history -->
				<!-- Do not display the 1. message-->
				{#each animMessages as message, i}
					<ChatMessageUI {message} animate={animMessages.length == 1 || (animMessages.length - 1 == i && message.extra == true)} {i} />
				{/each}

				<!-- Live Message -->
				{#if $isLoadingAnswerStore}
					<div class="place-self-start">
						<div class="rounded-2xl rounded-tl-none p-5 font-secondary text-lg">
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
