<script lang="ts">
	import type { ChatMessage as ChatMessageModel } from '$misc/shared';
	import ChatMessage from './ChatMessage.svelte';

	export let slug: string;
	export let siblings: ChatMessageModel[];

</script>

<!-- This TypeScript error is nonsense... -->
{#each siblings as message}
	<ChatMessage {slug} message={message} on:editMessage />	
{/each}
