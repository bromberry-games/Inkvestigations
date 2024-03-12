<script lang="ts">
	import { page } from '$app/stores';
	import { Pagination } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	export let totalPages: number;
	export let currentPage = 0;

	const previous = () => {
		currentPage = currentPage > 0 ? currentPage - 1 : 0;
	};
	const next = () => {
		currentPage = currentPage < totalPages - 1 ? currentPage + 1 : totalPages;
	};
</script>

<Pagination large on:previous={previous} on:next={next} icon normalClass="bg-quaternary text-tertiary-500 border-quaternary">
	<svelte:fragment slot="prev">
		<span class="sr-only">Previous</span>
		<ChevronLeftOutline class="h-3 w-3" />
	</svelte:fragment>
	<svelte:fragment slot="next">
		<span class="sr-only">Next</span>
		<ChevronRightOutline class="h-3 w-3" />
	</svelte:fragment>
</Pagination>
