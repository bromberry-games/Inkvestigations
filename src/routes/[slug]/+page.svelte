<script lang="ts">
	import { onDestroy, onMount,} from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { chatStore, isLoadingAnswerStore, } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import { estimateChatCost } from '$misc/openai';
	import { Button } from 'flowbite-svelte';
	import type ChatMessage from '$lib/gpt/ChatMessage.svelte';


	export let data: PageData;
	let userMessages = 0
	$: supabase = data.supabase

	async function updateUserMessages() {
		const { data } = await supabase.from("user_messages").select().limit(1).single();
      	userMessages = data.amount
	}

	$: ({ slug } = data);
	$: chat = $chatStore[slug];
	$: cost = chat ? estimateChatCost(chat) : null;
	$: if (chat) {
		let message = chat.messages[0];
		let count = 0;
		while (true) {
			if (!message.messages) {
				break;
			}
			console.log(message.content)
			message = message.messages[0];
			count++;
		}

		let post_fun = async () => {
			const response = await fetch('/api/add-message', {
				method: 'POST',
				body: JSON.stringify({ message: message.content, mystery: slug }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			console.log("posted")	
		}
		post_fun()

	}

	let chatInput: ChatInput;

	onMount(async () => {
		updateUserMessages();
	});

	function deleteChat() {
		chatStore.deleteChat(slug);
		goto('/mysteries');
	}

	function handleEditMessage(event: CustomEvent<ChatMessage>) {
		chatInput.editMessage(event.detail);
	}

</script>

{#if chat}
	<h1>{userMessages}</h1>
	<Button color="red" on:click={() => deleteChat()}>Delete chat</Button>
	<Chat {slug} on:editMessage={handleEditMessage}>
	</Chat> 
	<ChatInput {slug} chatCost={cost} bind:this={chatInput} on:chatInput={updateUserMessages}/>
{/if}