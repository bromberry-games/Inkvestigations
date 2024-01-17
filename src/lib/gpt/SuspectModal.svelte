<script lang="ts">
	import type { suspect } from '$lib/supabase/mystery_data.server';
	import { Modal, Radio, Button, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { textareaAutosizeAction } from 'svelte-legos';

	export let clickOutsideModal = false;
	export let suspects: suspect[];
	export let slug = '';
	export let suspectToAccuse = '';
	export let notes;
	$: if (suspectToAccuse != '') {
		clickOutsideModal = false;
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
		<textarea placeholder="Enter notes..." use:textareaAutosizeAction bind:value={notes.general}></textarea>
		{#each suspects as suspect}
			<div class="my-4 flex">
				<div class="mr-4 flex flex-col items-center justify-between">
					<img src={'/images/mysteries/' + slug.toLowerCase() + '/suspects/' + suspect.imagepath} alt={suspect.name} />
					<p class="sm:text-lg md:text-xl">{suspect.name}</p>
				</div>
				<Textarea autoResize class="w-full" placeholder="Enter notes..." bind:value={notes[suspect.name]}></Textarea>
			</div>
		{/each}
	</div>
</Modal>
