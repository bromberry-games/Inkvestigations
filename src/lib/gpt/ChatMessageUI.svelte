<script lang="ts">
	import type { ChatMessage } from '$misc/shared';
	import snarkdown from 'snarkdown';

	export let message: ChatMessage;
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
	<div class="font-secondary text-lg">
		{@html snarkdown(message.content.replace(/\n/g, '<br>'))}
	</div>
</div>
