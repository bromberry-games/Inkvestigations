<script lang="ts">
	import { onMount,} from 'svelte';
	import type { PageData } from './$types';
	import { chatStore,  } from '$misc/stores';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';

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
</script>

{#if chat}
	<Chat {slug} messages={data.messages}>
	</Chat> 
	<ChatInput {slug} on:chatInput={updateUserMessages} messagesAmount={userMessages} {suspectToAccuse} suspects={data.suspects}/>
{/if}