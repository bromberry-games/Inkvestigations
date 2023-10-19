<script lang="ts">
	import { onDestroy, onMount,} from 'svelte';
	import type { ActionData, PageData } from './$types';
	import { chatStore, isLoadingAnswerStore, } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import { Button, Modal, Radio } from 'flowbite-svelte';

	export let data: PageData;
	let suspectToAccuse = '';

	let userMessages = 0
	$: supabase = data.supabase


	async function updateUserMessages() {
		const { data } = await supabase.from("user_messages").select().limit(1).single();
		if(!data) {
			console.error("Could not get messages amount");
			return;
		}
      	userMessages = data.amount
	}
	$: ({ slug } = data);
	$: chat = $chatStore[slug];

	onMount(async () => {
		updateUserMessages();
	});

	function deleteChat(event: Event) {
		event.preventDefault();
		chatStore.deleteChat(slug);
		(event.target as HTMLButtonElement).form.submit();
	}
</script>

{#if chat}
	<Chat {slug} >
	</Chat> 
	<ChatInput {slug} on:chatInput={updateUserMessages} messagesAmount={userMessages} {suspectToAccuse} suspects={data.suspects}/>
{/if}