<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import type { ChatMessage } from '$misc/shared';

	export let data: PageData;
	let suspectToAccuse = '';

	let userMessages = 0;
	$: supabase = data.supabase;
	$: messages = data.messages;

	function addMessage(event: CustomEvent<ChatMessage>) {
		messages = [...messages, event.detail];
	}

	async function updateUserMessageAmountAndAddMessage(event: CustomEvent<ChatMessage>) {
		addMessage(event);
		updateUserMessagesAmount();
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
<ChatInput
	{slug}
	on:chatInput={addMessage}
	on:messageReceived={updateUserMessageAmountAndAddMessage}
	messagesAmount={userMessages}
	{suspectToAccuse}
	suspects={data.suspects}
	chatUnbalanced={messages.length % 2 !== 1}
/>
