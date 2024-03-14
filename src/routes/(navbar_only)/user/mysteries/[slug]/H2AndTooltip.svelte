<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import { QuestionCircleSolid } from 'flowbite-svelte-icons';

	export let title: string;
	export let tooltip: string;
	export let grid = 'col-span-2';
</script>

<div class={'mt-4 flex items-center justify-between ' + grid}>
	<h2 class="text-lg font-bold">{title}</h2>
	<QuestionCircleSolid />
	<Tooltip class="text-md w-96">{tooltip}</Tooltip>
</div>
