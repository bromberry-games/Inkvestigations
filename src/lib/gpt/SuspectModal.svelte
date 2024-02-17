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
		<textarea  placeholder="Enter notes..." use:textareaAutosizeAction bind:value={notes.general} class="rounded bg-amber-50  border-primary focus:ring-tertiary focus:border-primary"></textarea>
		{#each suspects as suspect}
			<hr class="rmy-1 h-0.5 border-0 bg-gray-800 dark:bg-gray-800" />
			<div class="mt-2 flex">
				<div class="mr-4 flex flex-col items-center justify-between">
					<img
						src={'/images/mysteries/' + slug.toLowerCase() + '/suspects/' + convertToSnakeCaseEnhanced(suspect.name) + '.webp'} class="rounded-sm mb-2"
						alt={suspect.name}
					/>
				</div>
				<div class="flex h-full w-full flex-col">
					<p class="uppercase sm:text-md font-primary md:text-xl text-gray-800">{suspect.name}</p>
					<textarea class="rounded h-full w-full bg-amber-50 border-primary focus:ring-tertiary focus:border-primary" placeholder="Enter notes..." use:textareaAutosizeAction bind:value={notes[suspect.name]} rows="2" 
					></textarea>
				</div>
			</div>
		{/each}
	</div>
</Modal>
