<script lang="ts">
	import { onDestroy, onMount,} from 'svelte';
	import type { ActionData, PageData } from './$types';
	import { chatStore, isLoadingAnswerStore, } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import { Button, Modal, Radio } from 'flowbite-svelte';
	import type ChatMessage from '$lib/gpt/ChatMessage.svelte';

	export let data: PageData;
	export let form: ActionData;
	console.log(form)

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
	}

	function handleEditMessage(event: CustomEvent<ChatMessage>) {
		chatInput.editMessage(event.detail);
	}

	function accuse(event: Event) {
		event.preventDefault();
		(event.target as HTMLButtonElement).form.submit();
		clickOutsideModal = false;
	}

	let clickOutsideModal = false;
</script>

<Button on:click={() => (clickOutsideModal = true)} color="red">Default modal</Button>
<Modal title="Suspects" bind:open={clickOutsideModal} size="md" outsideclose>
	<form method="post" action="?/accuse">
	<div class="grid gap-6 w-full grid-cols-2 md:grid-cols-3">
		{#each data.suspects as suspect}
  		<Radio name="suspects" value={suspect} custom>
  		  <div class="flex justify-between flex-col items-center p-5 w-full cursor-pointer peer-checked:border-solid peer-checked:border-2 peer-checked:border-slate-500" >
				<img src="/images/police_captain.png">
				<p>{suspect}</p>
  		  </div>
  		</Radio>
		{/each}
	</div>
	<div class="flex justify-center">
    	<Button type="submit" color="red" on:click={accuse}>Accuse</Button>
	</div>
	</form>
</Modal>

{#if chat}
	<h1>{userMessages}</h1>
	<form method="POST" action="?/delete">
		<Button color="red" on:click={deleteChat}>Delete chat</Button>
	</form>
	<Chat {slug} on:editMessage={handleEditMessage}>
	</Chat> 
	<ChatInput {slug} chatCost={cost} bind:this={chatInput} on:chatInput={updateUserMessages} messagesAmount={userMessages}/>
{/if}