<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
    import hljs from 'highlight.js';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { chatStore, isLoadingAnswerStore, } from '$misc/stores';
	import ChatInput from '$lib/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import { estimateChatCost } from '$misc/openai';
	import type {
		ChatMessage
	} from '$misc/shared';;

	export let data: PageData;

	$: ({ slug } = data);
	$: chat = $chatStore[slug];
	$: cost = chat ? estimateChatCost(chat) : null;

	let chatInput: ChatInput;

	onMount(async () => {
		await highlightCode();
	});

	const unsubscribeChatStore = chatStore.subscribe(async () => {
		await highlightCode();
	});

	const unsubscribeisLoadingAnswerStore = isLoadingAnswerStore.subscribe(async () => {
		await highlightCode();
	});

	onDestroy(() => {
		unsubscribeChatStore();
		unsubscribeisLoadingAnswerStore();
	});

	async function highlightCode() {
		await tick();
		//hljs.highlightAll();
	}

	function deleteChat() {
		chatStore.deleteChat(slug);
		goto('/');
	}

	async function handleCloseChat() {
		// untouched => discard
		if (chat.title === slug && !chat.contextMessage?.content && chat.messages.length === 0) {
			deleteChat();
		}

		goto('/');
	}

	function handleEditMessage(event: CustomEvent<ChatMessage>) {
		chatInput.editMessage(event.detail);
	}
</script>

{#if chat}

	<Chat {slug} on:editMessage={handleEditMessage}>
	</Chat> 
	<ChatInput {slug} chatCost={cost} bind:this={chatInput} />
{/if}