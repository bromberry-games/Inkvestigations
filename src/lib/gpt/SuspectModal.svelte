<script lang="ts">
	import { convertToSnakeCaseEnhanced } from '$lib/generic-helpers';
	import type { suspect } from '$lib/supabase/mystery_data.server';
	import { Modal, Radio, Button, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';

	export let clickOutsideModal = false;
	export let suspects: suspect[];
	export let slug = '';
	export let notes;
</script>

<Modal
	title="Notes"
	bind:open={clickOutsideModal}
	size="xl"
	outsideclose
	defaultClass="!bg-secondary overflow-y-auto"
	color="!bg-secondary"
>
	<div class="flex w-full flex-col">
		<textarea placeholder="Enter notes..." use:textareaAutosizeAction bind:value={notes.general} class="mb-4"></textarea>
		{#each suspects as suspect}
			<hr class="my-1 h-0.5 border-0 bg-gray-900 dark:bg-gray-700" />
			<div class="mt-2 flex">
				<div class="mr-4 flex flex-col items-center justify-between">
					<img
						src={'/images/mysteries/' + slug.toLowerCase() + '/suspects/' + convertToSnakeCaseEnhanced(suspect.name) + '.webp'}
						alt={suspect.name}
					/>
				</div>
				<Textarea autoResize class="w-full" placeholder="Enter notes..." bind:value={notes[suspect.name]}></Textarea>
			</div>
			<p class="sm:text-md md:text-lg">{suspect.name}</p>
		{/each}
	</div>
</Modal>
