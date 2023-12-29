<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import type { ChatMessage } from '$misc/shared';
	import { Button, Input, Modal } from 'flowbite-svelte';
	import { tokenStore } from '$misc/stores';

	export let data: PageData;
	let suspectToAccuse = '';

	let userMessages = { amount: 0, non_refillable_amount: 0 };
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
		const { data } = await supabase.from('user_messages').select('amount, non_refillable_amount').limit(1).single();
		if (!data) {
			console.error('Could not get messages amount');
			return;
		}
		userMessages = data;
	}
	$: ({ slug } = data);

	onMount(async () => {
		updateUserMessagesAmount();
		//I do not really like having to do this here. Is there a better way?
		tokenStore.useLocalStorage();
		tokenModal = data.session?.user.user_metadata.useMyOwnToken && $tokenStore == '';
	});

	let tokenModal = data.session?.user.user_metadata.useMyOwnToken && $tokenStore == '';
	$: console.log('modal', $tokenStore);
	$: openAiToken = $tokenStore;
	function storeTokenLocally() {
		if (openAiToken) {
			$tokenStore = openAiToken;
			console.log($tokenStore);
			tokenModal = false;
		}
	}
	function clearSetToken() {
		$tokenStore = '';
		openAiToken = '';
		tokenModal = false;
	}
</script>

{#if data.session?.user.user_metadata.useMyOwnToken}
	<Modal title="Use own openai token" bind:open={tokenModal} autoclose>
		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			If you are uncertain about the implications of using your personal OpenAI token, refrain from doing so and continue using the
			application in its standard mode. The code can be reviewed on GitHub for clarity. Be aware that while the token will be stored only
			locally in your browser and not on our servers, activating this feature still entails inherent security risks and the potential for
			unforeseen costs due to code errors. By enabling this setting, you acknowledge and agree that we are not liable for any charges
			incurred on your OpenAI account.
		</p>
		<Input type="password" name="openaiToken" id="openaiToken" placeholder="OpenAI token" bind:value={openAiToken}></Input>
		<Button on:click={clearSetToken} class="bg-red-500">clear token</Button>
		<Button on:click={() => (tokenModal = false)} class="bg-red-500">cancel</Button>
		<Button on:click={storeTokenLocally} class="bg-blue-500">I accept</Button>
	</Modal>

	<div class="flex w-full justify-center bg-quaternary">
		<Button on:click={() => (tokenModal = true)} class="!font-2xl my-2 bg-tertiary font-primary !text-quaternary">Change Token</Button>
	</div>
{/if}
<Chat {messages}></Chat>
<ChatInput
	{slug}
	on:chatInput={addMessage}
	on:messageReceived={updateUserMessageAmountAndAddMessage}
	messagesAmount={userMessages}
	{suspectToAccuse}
	suspects={data.suspects}
	chatUnbalanced={messages.length % 2 !== 1}
/>
