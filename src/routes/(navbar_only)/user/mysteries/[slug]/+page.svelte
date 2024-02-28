<script lang="ts">
	import { textareaAutosizeAction } from 'svelte-legos';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { mainSchema, submitSchema } from './schema';
	import SuperInput from '$lib/superforms/SuperInput.svelte';
	import { onMount } from 'svelte';
	import { CloseSolid } from 'flowbite-svelte-icons';
	import SuperTextarea from '$lib/superforms/SuperTextarea.svelte';
	import { Spinner } from 'flowbite-svelte';
	import SuperImage from '$lib/superforms/SuperImage.svelte';

	export let data: PageData;

	let save: boolean = true;
	let showTimeframe: boolean = false;

	const formAll = superForm(data.form, {
		validators: zodClient(mainSchema),
		dataType: 'json',
		resetForm: false
	});
	$: form = formAll.form;
	$: errors = formAll.errors;
	$: delayed = formAll.delayed;
	$: message = formAll.message;

	onMount(() => {
		if ($form.suspects == undefined || $form.suspects.length === 0) {
			$form.suspects = [{ name: '', description: '' }];
		}
		if ($form.timeframes == undefined || $form.timeframes.length === 0) {
			$form.timeframes = [];
		}
		if ($form.action_clues == undefined || $form.action_clues.length === 0) {
			$form.action_clues = [{ action: '', clue: '' }];
		}
	});

	function addSuspect() {
		if ($form.suspects == undefined) {
			throw new Error('suspects is undefined');
		}
		$form.suspects = [...$form.suspects, { name: '', description: '', image: undefined }];
	}
	function addTimeFrame() {
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
	$: if ($errors.suspects) {
		console.log($errors.suspects);
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="flex w-full justify-center bg-tertiary pt-16">
	<form
		enctype="multipart/form-data"
		method="POST"
		action={save ? '?/save' : '?/submit'}
		class="mx-4 grid grid-cols-[1fr_4fr] rounded bg-blue-200 p-4 lg:w-1/2 lg:grid-cols-[1fr_10fr] lg:gap-4"
		use:formAll.enhance
	>
		<input type="hidden" name="id" bind:value={$form.id} />
		<SuperInput
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.name"
			form={formAll}
			placeholder="Forced Farewell"
			labelName="Name"
		/>
		<SuperImage inputClass={inputClassFull} errorClass="col-span-2" field="mystery.image" {formAll} labelName="Thumbnail"></SuperImage>
		<SuperTextarea
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.setting"
			form={formAll}
			placeholder="England in the 1890s, a small town called Romey"
			labelName="Setting"
		/>
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.description" form={formAll} labelName="Description" />
		<SuperInput inputClass={inputClassFull} errorClass="col-span-2" field="mystery.theme" form={formAll} labelName="Theme" />
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
		<SuperTextarea
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.solution"
			form={formAll}
			placeholder="Solve the mystery"
			labelName="Solution"
		/>

		<SuperTextarea inputClass={inputClassFull} errorClass="col-span-2" field="mystery.letter_info" form={formAll} labelName="Letter" />
		<h2 class="col-span-2 text-lg font-bold">Suspects</h2>
		{#each $form.suspects || [] as suspect, index (index)}
			<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-blue-100 p-4">
				<div class="col-span-2 flex justify-end">
					<button type="button" class="" on:click={() => removeItem('suspects', index)}><CloseSolid></CloseSolid></button>
				</div>
				<SuperImage inputClass={inputClassFull} errorClass="col-span-2" field="suspects[{index}].image" {formAll} labelName="Thumbnail"
				></SuperImage>
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
			</div>
		{/each}
		{#if $errors.suspects}
			<span class="col-span-2">{$errors.suspects}</span>
		{/if}
		<button type="button" class="col-span-2 bg-green-500" on:click={addSuspect} data-testid="add-suspect">Add Suspect</button>
		<hr class="col-span-2 border-slate-900" />

		<input type="checkbox" class="col-span-1" name="show-timeframe" bind:checked={showTimeframe} />
		<h2 class="col-span-1 text-lg font-bold">Timeframe</h2>
		{#if showTimeframe}
			{#each $form?.timeframes || [] as timeframe, index (index)}
				<div class="col-span-2 flex justify-end">
					<button type="button" class="" on:click={() => removeItem('timeframes', index)}><CloseSolid></CloseSolid></button>
				</div>
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
				<hr class="col-span-2 border-slate-900" />
			{/each}
			<button type="button" on:click={addTimeFrame} class="4 col-span-2 bg-green-500">Add Event</button>
		{/if}

		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Inspector Actions</h2>
		{#each $form.action_clues || [] as action, index (index)}
			<div class="col-span-2 flex justify-end">
				<button type="button" class="" on:click={() => removeItem('action_clues', index)}><CloseSolid></CloseSolid></button>
			</div>
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
			<hr class="col-span-2 border-slate-900" />
		{/each}
		<button type="button" on:click={addAction} class="col-span-2 bg-green-500" data-testid="add-action">Add Action</button>

		<hr class="col-span-2 border-slate-900" />
		{#if $message}
			<p class="col-span-2 text-green-500">
				{$message}
			</p>
		{/if}
		{#if $delayed}
			<Spinner color="gray"></Spinner>{/if}
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
