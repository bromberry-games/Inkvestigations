<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ChatInput from '$lib/gpt/ChatInput.svelte';
	import Chat from '$lib/gpt/Chat.svelte';
	import type { ChatMessage } from '$misc/shared';
	import { Button, Input, Modal } from 'flowbite-svelte';
	import { messageAmountStore, tokenStore, updateMessageCounter } from '$misc/stores';
	import { AddressCardSolid, RotateOutline } from 'flowbite-svelte-icons';
	import { getAuthStatus } from '$lib/auth-helper';
	import SuspectModal from '$lib/gpt/SuspectModal.svelte';

	export let data: PageData;

	let suspectToAccuse = '';
	let userMessages = { amount: 0, non_refillable_amount: 0 };
	let tokenModal = data.session?.user.user_metadata.useMyOwnToken && $tokenStore == '';
	let suspectModal = false;

	$: supabase = data.supabase;
	$: messages = buildMessagesList(data.messages);
	$: openAiToken = $tokenStore;
	$: ({ slug } = data);
	$: if (suspectModal == false) {
		saveNotes();
	}
	async function saveNotes() {
		const { error } = await data.supabase.from('conversation_notes').upsert({ conversation_id: data.convId, notes: data.notes });
		if (error) console.log(error);
	}

	function addMessage(event: CustomEvent<ChatMessage>) {
		messages = buildMessagesList([...messages.filter((m) => m.extra == undefined || m.extra == false), event.detail]);
	}

	function buildMessagesList(chat: { role: string; content: string; extra?: boolean }[]) {
		const eventMessages = data.eventMessages.filter((event) => event.show_at_message <= (chat.length - 1) / 2);
		if (!eventMessages || eventMessages.length == 0) return chat;
		let tmpMessages = Array(chat.length + eventMessages.length);
		let i = 0;
		for (let j = 0; j < chat.length; j += 2) {
			tmpMessages[j + i] = chat[j];
			if (i < eventMessages.length && j / 2 == eventMessages[i].show_at_message) {
				tmpMessages[j + i + 1] = {
					role: 'assistant',
					content: eventMessages[i].letter,
					extra: true
				};
				i += 1;
			}
			if (j + 1 >= chat.length) break;
			tmpMessages[j + i + 1] = chat[j + 1];
		}
		return tmpMessages;
	}

	async function updateUserMessageAmountAndAddMessage(event: CustomEvent<ChatMessage>) {
		addMessage(event);
		updateMessageCounter(data.supabase, data.session?.user.id);
		// updateUserMessagesAmount();
	}

	async function updateUserMessagesAmount() {
		const { data } = await supabase.from('user_messages').select('amount, non_refillable_amount').limit(1).single();
		if (!data) {
			console.error('Could not get messages amount');
			return;
		}
		userMessages = data;
	}

	onMount(async () => {
		updateUserMessagesAmount();
		//I do not really like having to do this here. Is there a better way?
		tokenStore.useLocalStorage();
		tokenModal = data.session?.user.user_metadata.useMyOwnToken && $tokenStore == '';
	});

	function storeTokenLocally() {
		if (openAiToken) {
			$tokenStore = openAiToken;
			tokenModal = false;
		}
	}

	function clearSetToken() {
		$tokenStore = '';
		openAiToken = '';
		tokenModal = false;
	}
</script>

<SuspectModal bind:clickOutsideModal={suspectModal} bind:suspectToAccuse suspects={data.suspects} {slug} bind:notes={data.notes}
></SuspectModal>
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
<!-- <Button class="sticky top-24 bg-red-500">RESET CHAT</Button> -->
<Chat {messages}>
	<form slot="additional-content-top" action="?/archiveChat" method="POST" class="sticky top-24">
		<Button type="submit" class="mx-2 w-1/3 bg-gray-500 font-secondary text-xs text-gray-300 md:mx-8 lg:w-1/6 xl:w-1/12">
			<RotateOutline class="mr-1" />RESET CHAT</Button
		>
	</form>
</Chat>
<ChatInput
	{slug}
	on:chatInput={addMessage}
	on:messageReceived={updateUserMessageAmountAndAddMessage}
	messagesAmount={userMessages}
	{suspectToAccuse}
	suspects={data.suspects}
	chatUnbalanced={messages.filter((m) => m.extra == undefined || m.extra == false).length % 2 !== 1}
	authStatus={getAuthStatus(data.session)}
	metered={data.metered}
>
	<Button
		slot="notes-button"
		class="mr-1 bg-secondary !p-2 font-primary text-xl text-quaternary md:mx-2 md:px-5"
		on:click={() => (suspectModal = true)}><AddressCardSolid></AddressCardSolid></Button
	>
</ChatInput>
