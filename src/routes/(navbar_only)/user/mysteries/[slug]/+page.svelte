<script lang="ts">
	import { textareaAutosizeAction } from 'svelte-legos';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { mainSchema, submitSchema } from './schema';
	import SuperInput from '$lib/superforms/SuperInput.svelte';
	import { onMount } from 'svelte';
	import { CloseSolid, QuestionCircleSolid } from 'flowbite-svelte-icons';
	import SuperTextarea from '$lib/superforms/SuperTextarea.svelte';
	import { Spinner, Tooltip } from 'flowbite-svelte';
	import SuperImage from '$lib/superforms/SuperImage.svelte';
	import H2AndTooltip from './H2AndTooltip.svelte';

	export let data: PageData;

	let save: boolean = true;
	let showTimeframe: boolean = false;

	const formAll = superForm(data.form, {
		validators: zodClient(mainSchema),
		dataType: 'json',
		resetForm: false,
		taintedMessage: true
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
		if ($form.few_shots_known_answers == undefined || $form.few_shots_known_answers.length === 0) {
			$form.few_shots_known_answers = [
				{ question: '', answer: '' },
				{ question: '', answer: '' }
			];
		}
		if ($form.few_shots_unknown_answers == undefined || $form.few_shots_unknown_answers.length === 0) {
			$form.few_shots_unknown_answers = [
				{ question: '', answer: '' },
				{ question: '', answer: '' }
			];
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
<div class="bg-tertiary-400 flex w-full justify-center pt-8">
	<form
		enctype="multipart/form-data"
		method="POST"
		action={save ? '?/save' : '?/submit'}
		class="bg-tertiary-300 mx-4 grid grid-cols-[1fr_4fr] gap-2 rounded p-4 lg:w-1/2 lg:grid-cols-[1fr_10fr] lg:gap-2 xl:px-8"
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
		<SuperInput
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.description"
			form={formAll}
			labelName="Description"
			placeholder="A boy is found missing."
		/>
		<SuperInput
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.theme"
			form={formAll}
			labelName="Theme"
			placeholder="escape and transformation"
		/>
		<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-tertiary-100 px-4 pb-4 pt-2">
			<h2 class="col-span-2 text-lg font-bold">Victim</h2>
			<SuperImage inputClass={inputClassFull} errorClass="col-span-2" field="mystery.victim_image" {formAll} labelName="Thumbnail"
			></SuperImage>
			<SuperInput
				inputClass={inputClassHalf}
				field="mystery.victim_name"
				form={formAll}
				labelName="Name"
				errorClass="col-span-2"
				placeholder="John Toilard"
			/>
			<SuperTextarea
				inputClass={inputClassHalf}
				field="mystery.victim_description"
				form={formAll}
				labelName="Description"
				errorClass="col-span-2"
				placeholder="kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives."
			/>
		</div>
		<SuperTextarea
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.solution"
			form={formAll}
			placeholder="Solve the mystery"
			labelName="Solution"
		/>

		<SuperTextarea
			inputClass={inputClassFull}
			errorClass="col-span-2"
			field="mystery.letter_info"
			form={formAll}
			labelName="Letter"
			placeholder="Dear Mr. Sherlock Holmes, ..."
		/>
		<H2AndTooltip
			title="Characters"
			tooltip="All important characters in the mystery. Provide a short descirption that describes them. Do not add hidden information here. That will be input into action clues."
		/>
		{#each $form.suspects || [] as suspect, index (index)}
			<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-tertiary-100 px-4 pb-4 pt-2">
				<div class="col-span-2 flex justify-end">
					<button type="button" class="" on:click={() => removeItem('suspects', index)}><CloseSolid class="h-4 w-4"></CloseSolid></button>
				</div>
				<SuperImage inputClass={inputClassFull} errorClass="col-span-2" field="suspects[{index}].image" {formAll} labelName="Thumbnail"
				></SuperImage>
				<SuperInput
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="suspects[{index}].name"
					form={formAll}
					labelName="Name"
					placeholder="Butler Jesob"
				/>
				<SuperTextarea
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
		<button type="button" class="col-span-2 rounded bg-quaternary py-1 text-white" on:click={addSuspect} data-testid="add-suspect"
			>Add Suspect</button
		>
		<hr class="col-span-2 border-slate-900" />

		<input type="checkbox" class="col-span-1 mt-5" name="show-timeframe" bind:checked={showTimeframe} />
		<H2AndTooltip
			title="Events"
			tooltip="All events in the mystery. Provide a short descirption that describes them. Do not add hidden information here. That will be input into action clues."
			grid="col-span-1"
		/>
		{#if showTimeframe}
			{#each $form?.timeframes || [] as timeframe, index (index)}
				<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-blue-100 px-4 pb-4 pt-2">
					<div class="col-span-2 flex justify-end">
						<button type="button" class="" on:click={() => removeItem('timeframes', index)}
							><CloseSolid class="h-4 w-4"></CloseSolid></button
						>
					</div>
					<SuperInput
						inputClass="rounded border border-gray-300 px-2 py-1"
						errorClass="col-span-2"
						field="timeframes[{index}].timeframe"
						form={formAll}
						labelName="Time"
						placeholder="09:00AM"
					/>
					<SuperTextarea
						inputClass="rounded border border-gray-300 px-2 py-1"
						errorClass="col-span-2"
						field="timeframes[{index}].event_happened"
						form={formAll}
						labelName="event"
						placeholder="The Toillards leave the butler Jessob and John at home"
					/>
				</div>
			{/each}
			<button type="button" on:click={addTimeFrame} class="4 col-span-2 rounded bg-quaternary py-1 text-white">Add Event</button>
		{/if}

		<hr class="col-span-2 border-slate-900" />
		<H2AndTooltip
			title="Inspector actions"
			tooltip="Important clues for solving the mystery. These are predifned clues which dictate the flow of the mystery."
		/>
		{#each $form.action_clues || [] as action, index (index)}
			<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-tertiary-100 px-4 pb-4 pt-2">
				<div class="col-span-2 flex justify-end">
					<button type="button" class="" on:click={() => removeItem('action_clues', index)}
						><CloseSolid class="h-4 w-4"></CloseSolid></button
					>
				</div>
				<SuperInput
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="action_clues[{index}].action"
					form={formAll}
					labelName="Action"
					placeholder="Who was in the house when the boy disappeared"
				/>
				<SuperTextarea
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="action_clues[{index}].clue"
					form={formAll}
					labelName="Clue"
					placeholder="there was no one in the house, the butler says it was an emergency... "
				/>
			</div>
		{/each}
		<button type="button" on:click={addAction} class="col-span-2 rounded bg-quaternary py-1 text-white" data-testid="add-action"
			>Add Action</button
		>

		<H2AndTooltip
			title="Examples with known information"
			tooltip="
				To make answers in your mysteries more convincing you should provide some examples. In this case think of questions that a player
				of your mysteries might ask, that asks about information you input before. For example from your inspector actions. Your answer
				should only output information and not in a conversational tone."
		/>
		{#each $form.few_shots_known_answers || [] as fewShot, index (index)}
			<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-tertiary-100 p-4">
				<SuperInput
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="few_shots_known_answers[{index}].question"
					form={formAll}
					labelName="Question"
					placeholder="Search the crime scene"
				/>
				<SuperTextarea
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="few_shots_known_answers[{index}].answer"
					form={formAll}
					labelName="Answer"
					placeholder="We found a knife, ..."
				/>
			</div>
		{/each}
		<H2AndTooltip
			title="Examples with madeup informations"
			tooltip="To make answers in your mysteries more convincing you should provide some examples. In this case think of questions that a player -->
		of your mysteries might ask, that asks about information you did not input before. It could ask something specific about a suspect. -->
		Your answer should only output information and not in a conversational tone."
		/>
		{#each $form.few_shots_unknown_answers || [] as fewShot, index (index)}
			<div class="col-span-2 grid grid-cols-subgrid gap-2 rounded bg-tertiary-100 p-4">
				<SuperInput
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="few_shots_unknown_answers[{index}].question"
					form={formAll}
					labelName="Question"
					placeholder="Interrogate the victims colleagues"
				/>
				<SuperTextarea
					inputClass="rounded border border-gray-300 px-2 py-1"
					errorClass="col-span-2"
					field="few_shots_unknown_answers[{index}].answer"
					form={formAll}
					labelName="Answer"
					placeholder="They say that he..."
				/>
			</div>
		{/each}

		{#if $message}
			<p class="col-span-2 text-green-500">
				{$message}
			</p>
		{/if}
		{#if $delayed}
			<Spinner color="gray"></Spinner>{/if}
		<div class="col-span-2 flex justify-end gap-2">
			<button type="submit" on:click={() => (save = false)} class="rounded border border-quaternary px-4 py-2">SUBMIT</button>
			<button
				type="submit"
				on:click={() => (save = true)}
				class="rounded border border-gray-300 bg-blue-200 bg-quaternary px-4 py-2 text-white">SAVE</button
			>
		</div>
	</form>
</div>
