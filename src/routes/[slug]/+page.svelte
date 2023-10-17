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
	<h1>{userMessages}</h1>
	<form method="POST" action="?/delete">
		<Button color="red" on:click={deleteChat}>Delete chat</Button>
	</form>
	<Chat {slug} >
	</Chat> 
	<ChatInput {slug} on:chatInput={updateUserMessages} messagesAmount={userMessages} {suspectToAccuse} suspects={data.suspects}/>
{/if}