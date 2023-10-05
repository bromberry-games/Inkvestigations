<script lang="ts">
	import { onDestroy, onMount,} from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { chatStore, isLoadingAnswerStore, } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import { Button } from 'flowbite-svelte';
	import type ChatMessage from '$lib/gpt/ChatMessage.svelte';


	export let data: PageData;
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

	let cost = 0;
	$: ({ slug } = data);
	$: chat = $chatStore[slug];
	//$: cost = chat ? estimateChatCost(chat) : null;
	$: if (chat && chat.messages.length > 2) {
		const lastMessage = chat.messages[chat.messages.length - 1];
    
    	let post_fun = async () => {
    	    try {
    	        const response = await fetch('/api/add-message', {
    	            method: 'POST',
    	            body: JSON.stringify({ message: lastMessage.content, mystery: slug }),
    	            headers: {
    	                'Content-Type': 'application/json'
    	            }
    	        });

    	        if (!response.ok) {
    	            throw new Error(`HTTP error! Status: ${response.status}`);
    	        }

    	    } catch (error) {
    	        console.error('Failed to post message', error);
    	    }
    	}
    	post_fun();
	}

	let chatInput: ChatInput;

	onMount(async () => {
		updateUserMessages();
	});

	function deleteChat(event: Event) {
		event.preventDefault();
		chatStore.deleteChat(slug);
		(event.target as HTMLButtonElement).form.submit();
		//goto('/mysteries');
	}

	function handleEditMessage(event: CustomEvent<ChatMessage>) {
		chatInput.editMessage(event.detail);
	}

</script>

{#if chat}
	<h1>{userMessages}</h1>
	<form method="POST" action="?/delete">
		<Button color="red" on:click={deleteChat}>Delete chat</Button>
	</form>
	<Chat {slug} on:editMessage={handleEditMessage}>
	</Chat> 
	<ChatInput {slug} chatCost={cost} bind:this={chatInput} on:chatInput={updateUserMessages}/>
{/if}