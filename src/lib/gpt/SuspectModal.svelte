<script lang="ts">
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { convertToSnakeCaseEnhanced } from '$lib/generic-helpers';
	import type { suspect } from '$lib/supabase/mystery_data.server';
	import { Modal, Radio, Button, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';

	export let clickOutsideModal = false;
	export let suspects: suspect[];
	export let nameParsed = '';
	export let slug: string;
	export let notes;
	export let accessCode: string;

	let bucketPath: string = PUBLIC_SUPABASE_URL + '/storage/v1/object/public/user_mysteries/';

	function suspectPath(access_code: string, suspectName: string) {
		if (access_code != 'user') {
			return '/images/mysteries/' + nameParsed.toLowerCase() + '/suspects/' + convertToSnakeCaseEnhanced(suspectName) + '.webp';
		}

		const path = bucketPath + slug + '/published/' + convertToSnakeCaseEnhanced(suspectName) + '?' + Math.random();
		return path;
	}
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
			class="focus:border-tertiary focus:ring-tertiary mb-2 rounded border-primary bg-amber-50 focus:ring-2"
		></textarea>
		{#each suspects as suspect}
			<hr class="rmy-1 h-0.5 border-0 bg-gray-800 dark:bg-gray-800" />
			<div class="mt-2 flex">
				<div class="mr-4 flex flex-col items-center justify-between">
					<img src={suspectPath(accessCode, suspect.name)} class="mb-2 rounded-sm" alt={suspect.name} width="150" height="150" />
				</div>
				<div class="flex h-full w-full flex-col">
					<p class="sm:text-md font-primary uppercase text-gray-800 md:text-xl">{suspect.name}</p>
					<textarea
						class="focus:border-tertiary focus:ring-tertiary h-full w-full rounded border-primary bg-amber-50 focus:ring-2"
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
