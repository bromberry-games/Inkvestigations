<script lang="ts">
	import type { ChatMessage as ChatMessageModel } from '$misc/shared';
	import ChatMessage from './ChatMessage.svelte';

	export let slug: string;
	export let siblings: ChatMessageModel[];

</script>

<!-- This TypeScript error is nonsense... -->
<ChatMessage {slug} message={siblings[0]} renderChildren on:editMessage />

