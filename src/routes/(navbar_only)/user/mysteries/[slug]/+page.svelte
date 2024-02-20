<script lang="ts">
	import { textareaAutosizeAction } from 'svelte-legos';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import FormError from '../FormError.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { mainSchema, submitSchema } from './schema';
	import SuperInput from '$lib/superforms/SuperInput.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let save: boolean = true;

	const formAll = superForm(data.form, {
		validators: zodClient(mainSchema),
		dataType: 'json',
		resetForm: false
	});
	$: form = formAll.form;
	$: errors = formAll.errors;
	$: enhance = formAll.enhance;
	// let { form, errors, enhance, options, constraints } = formAll;
	// $: if (formAll) {
	// ({ form, errors, enhance, options, constraints } = formAll);
	// }

	onMount(() => {
		if ($form.suspects == undefined || $form.suspects.length === 0) {
			$form.suspects = [{ name: '', description: '' }];
		}
		if ($form.timeframes == undefined || $form.timeframes.length === 0) {
			$form.timeframes = [{ timeframe: '', event_happened: '' }];
		}
		if ($form.action_clues == undefined || $form.action_clues.length === 0) {
			$form.action_clues = [{ action: '', clue: '' }];
		}
	});

	function addSuspect() {
		if ($form.suspects == undefined) {
			throw new Error('suspects is undefined');
		}
		$form.suspects = [...$form.suspects, { name: '', description: '' }];
	}
	function addEvent() {
		$form.timeframes = [...$form.timeframes, { timeframe: '', event_happened: '' }];
	}
	function addAction() {
		$form.action_clues = [...$form.action_clues, { action: '', outcome: '' }];
	}
	function removeItem(arrayName: string, index: number) {
		const array = $form[arrayName];
		if (array && Array.isArray(array)) {
			$form[arrayName] = array.filter((_, i) => i !== index);
		}
	}
	const inputClassHalf = 'col-span-1 rounded border border-gray-300 px-2 py-1';
	const inputClassFull = 'col-span-2 rounded border border-gray-300 px-2 py-1';
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="mt-16 flex justify-center bg-tertiary">
	<form
		enctype="multipart/form-data"
		method="POST"
		action={save ? '?/save' : '?/submit'}
		class="grid grid-cols-[1fr_10fr] gap-4 lg:w-1/2"
		use:formAll.enhance
	>
		<input type="hidden" name="id" bind:value={$form.id} />
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.name" form={formAll} placeholder="Forced Farewell" />
		<hr class="col-span-2 border-slate-900" />
		<input
			class="col-span-2"
			type="file"
			name="image"
			accept="image/png, image/jpeg, image/webp"
			on:input={(e) => ($form.mystery.image = e.currentTarget.files?.item(0) ?? null)}
		/>
		{#if $errors.mystery?.image}<span>{$errors.mystery.image}</span>{/if}
		<SuperInput
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.setting"
			form={formAll}
			placeholder="England in the 1890s, a small town called Romey"
		/>
		<hr class="col-span-2 border-slate-900" />
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.description" form={formAll} />
		<hr class="col-span-2 border-slate-900" />
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.theme" form={formAll} />
		<hr class="col-span-2 border-slate-900" />
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.letter_info" form={formAll} />
		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Victim</h2>
		<SuperInput
			inputClass={inputClassHalf}
			field="mystery.victim_name"
			form={formAll}
			labelName="Name"
			errorClass="col-span-2"
			placeholder="John Toilard"
		/>
		<SuperInput
			inputClass={inputClassHalf}
			field="mystery.victim_description"
			form={formAll}
			labelName="Description"
			errorClass="col-span-2"
			placeholder="kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives."
		/>
		<hr class="col-span-2 border-slate-900" />
		<SuperInput
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.solution"
			form={formAll}
			placeholder="Solve the mystery"
		/>

		<h2 class="col-span-2 text-lg font-bold">Suspects</h2>
		{#each $form.suspects || [] as suspect, index (index)}
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="suspects[{index}].name"
				form={formAll}
				labelName="Suspect"
				placeholder="Butler Jesob"
			/>
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="suspects[{index}].description"
				form={formAll}
				labelName="Description"
				placeholder="A long-time butler and good friend of the family, loves the children."
			/>
			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('suspects', index)}>Remove Suspect</button>
		{/each}
		<button type="button" class="col-span-2 bg-green-500" on:click={addSuspect}>Add Suspect</button>
		<hr class="col-span-2 border-slate-900" />

		<h2 class="col-span-2 text-lg font-bold">Timeframe</h2>
		{#each $form?.timeframes || [] as timeframe, index (index)}
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="timeframes[{index}].timeframe"
				form={formAll}
				labelName="Time"
			/>
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="timeframes[{index}].event_happened"
				form={formAll}
				labelName="event"
			/>
			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('timeframes', index)}>Remove Event</button>
		{/each}
		<button type="button" on:click={addEvent} class="4 col-span-2 bg-green-500">Add Event</button>

		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Inspector Actions</h2>
		{#each $form.action_clues || [] as action, index (index)}
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="action_clues[{index}].action"
				form={formAll}
				labelName="Action"
			/>
			<SuperInput
				inputClass="rounded border border-gray-300 px-2 py-1"
				errorClass="col-span-2"
				field="action_clues[{index}].clue"
				form={formAll}
				labelName="Clue"
			/>

			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('action_clues', index)}>Remove Event</button>
		{/each}
		<button type="button" on:click={addAction} class="col-span-2 bg-green-500">Add Action</button>

		<hr class="col-span-2 border-slate-900" />
		<button
			type="submit"
			on:click={() => (save = true)}
			class="col-span-2 rounded border border-gray-300 bg-blue-200 px-4 py-2 hover:bg-blue-100">save</button
		>
		<button
			type="submit"
			on:click={() => (save = false)}
			class="col-span-2 rounded border border-gray-300 bg-blue-200 px-4 py-2 hover:bg-blue-100">Submit</button
		>
	</form>
</div>
