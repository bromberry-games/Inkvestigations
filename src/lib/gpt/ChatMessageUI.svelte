<script lang="ts">
	import typewriter from '$lib/transitions';
	import type { ChatMessage } from '$misc/shared';
	import snarkdown from 'snarkdown';

	export let message: ChatMessage;
	export let animate: boolean = false;
	export let i: string;
</script>

<div
	class="grid w-full px-5 py-2 {message.role === 'assistant' ? 'md:place-self-start' : 'border-secondary bg-secondary md:place-self-end'}"
	class:variant-ghost-surface={message.role === 'user'}
	class:variant-ghost-secondary={message.role === 'assistant'}
	class:variant-ghost-warning={message.isAborted}
	class:rounded-tl-none={message.role === 'assistant'}
	class:rounded-tr-none={message.role === 'user'}
>
	<!-- Header -->
	<div class="mb-1 flex items-center justify-between space-x-12">
		<!-- Author -->
		<span class="font-bold">{message.role === 'user' ? 'You' : 'Police chief'}:</span>
	</div>

	<!-- Message Content -->
	{#if animate}
		<div class="font-secondary text-lg" in:typewriter|global={{ delay: 0, speed: 7 }}>
			{@html snarkdown(message.content.replace(/\n/g, '<br>'))}
		</div>
	{:else}
		<div class="font-secondary text-lg" id={'message-' + i + '-content'}>
			{@html snarkdown(message.content.replace(/\n/g, '<br>'))}
		</div>
	{/if}
</div>
