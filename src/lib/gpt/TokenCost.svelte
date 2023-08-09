<script lang="ts">
	import { CircleStack } from '@inqling/svelte-icons/heroicon-24-solid';

	export let tokens: number;

</script>

<div class="flex items-center text-xs text-slate-500">
	<CircleStack class="w-4 h-4" />
	<span>{tokens}</span>
</div>
