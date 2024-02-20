<script lang="ts">
	import { convertToSnakeCaseEnhanced } from '$lib/generic-helpers';
	import type { suspect } from '$lib/supabase/mystery_data.server';
	import { Modal, Radio, Button, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';

	export let clickOutsideModal = false;
	export let suspects: suspect[];
	export let nameParsed = '';
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
		<textarea
			placeholder="Enter notes..."
			use:textareaAutosizeAction
			bind:value={notes.general}
			class="mb-2 rounded border-primary bg-amber-50 focus:border-tertiary focus:ring-2 focus:ring-tertiary"
		></textarea>
		{#each suspects as suspect}
			<hr class="rmy-1 h-0.5 border-0 bg-gray-800 dark:bg-gray-800" />
			<div class="mt-2 flex">
				<div class="mr-4 flex flex-col items-center justify-between">
					<img
<<<<<<< HEAD
						src={'/images/mysteries/' + nameParsed.toLowerCase() + '/suspects/' + convertToSnakeCaseEnhanced(suspect.name) + '.webp'}
=======
						src={'/images/mysteries/' + slug.toLowerCase() + '/suspects/' + convertToSnakeCaseEnhanced(suspect.name) + '.webp'}
						class="mb-2 rounded-sm"
>>>>>>> dev
						alt={suspect.name}
					/>
				</div>
				<div class="flex h-full w-full flex-col">
					<p class="sm:text-md font-primary uppercase text-gray-800 md:text-xl">{suspect.name}</p>
					<textarea
						class="h-full w-full rounded border-primary bg-amber-50 focus:border-tertiary focus:ring-2 focus:ring-tertiary"
						placeholder="Enter notes..."
						use:textareaAutosizeAction
						bind:value={notes[suspect.name]}
						rows="2"
					></textarea>
				</div>
			</div>
		{/each}
	</div>
</Modal>
