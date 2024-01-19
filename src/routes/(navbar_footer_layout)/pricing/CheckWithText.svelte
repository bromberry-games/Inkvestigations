<script>
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	export let text = '';
</script>

<li class="flex space-x-2">
	<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
	<span class="font-secondary text-xl font-normal leading-tight text-gray-500">{text}</span>
</li>
