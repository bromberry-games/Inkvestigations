<script>
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
</script>

<li class="flex space-x-2 font-secondary text-xl font-normal leading-tight text-gray-500 items-center">
	<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
	<slot>

	</slot>
</li>
