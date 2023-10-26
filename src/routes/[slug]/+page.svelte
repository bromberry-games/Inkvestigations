<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { chatStore } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import type { ChatMessage } from '$misc/shared';

	export let data: PageData;
	let suspectToAccuse = '';

	let userMessages = 0;
	$: supabase = data.supabase;
	$: messages = data.messages;

	function addMessage(event: CustomEvent<ChatMessage>) {
		console.log(messages);
		messages = [...messages, event.detail];
		console.log('added message');
		console.log(event.detail);
		console.log(messages);
	}

	async function updateUserMessagesAmount() {
		const { data } = await supabase.from('user_messages').select().limit(1).single();
		if (!data) {
			console.error('Could not get messages amount');
			return;
		}
		userMessages = data.amount;
	}
	$: ({ slug } = data);

	onMount(async () => {
		updateUserMessagesAmount();
	});
</script>

<Chat {slug} {messages}></Chat>
<ChatInput {slug} on:chatInput={addMessage} messagesAmount={userMessages} {suspectToAccuse} suspects={data.suspects} />
