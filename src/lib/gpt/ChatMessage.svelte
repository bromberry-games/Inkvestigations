<script lang="ts">
	import type { ChatMessage } from '$misc/shared';
	import snarkdown from 'snarkdown';
	import { chatStore } from '$misc/stores';

	export let slug: string;
	export let message: ChatMessage;
</script>

	
<div
	class="grid px-5 w-full py-2 border border-custom-secondary {message.role === 'assistant'
		? 'md:place-self-start bg-custom-ternary'
		: 'md:place-self-end bg-custom-secondary'}"
	class:variant-ghost-surface={message.role === 'user'}
	class:variant-ghost-secondary={message.role === 'assistant'}
	class:variant-ghost-warning={message.isAborted}
	class:rounded-tl-none={message.role === 'assistant'}
	class:rounded-tr-none={message.role === 'user'}
>
	<!-- Header -->
	<div class="flex justify-between space-x-12 mb-1 items-center">
		<!-- Author -->
		<span class="font-bold">{message.role === 'user' ? 'You' : 'Police chief'}:</span>

		<div class="flex space-x-4">
			{#if $chatStore[slug] && message.id}
				<div class="flex space-x-0">
				</div>
			{/if}
		</div>
	</div>

	<!-- Message Content -->
	<div class="font-secondary text-lg">
		{@html snarkdown(message.content.replace(/\n/g, "<br>"))}
	</div>
</div>
