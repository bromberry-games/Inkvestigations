<script lang="ts">
	import { textareaAutosizeAction } from 'svelte-legos';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Error from '../error.svelte';

	export let data: PageData;

	let save: boolean = true;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		dataType: 'json'
	});

	if ($form.suspects == undefined || $form.suspects.length === 0) {
		$form.suspects = [{ name: '', description: '' }];
	}
	if ($form.events == undefined || $form.events.length === 0) {
		$form.events = [{ time: '', description: '' }];
	}
	if ($form.inspectorActions == undefined || $form.inspectorActions.length === 0) {
		$form.inspectorActions = [{ action: '', outcome: '' }];
	}

	function addSuspect() {
		$form.suspects = [...$form.suspects, { name: '', description: '' }];
	}
	function addEvent() {
		$form.events = [...$form.events, { time: '', description: '' }];
	}
	function addAction() {
		$form.inspectorActions = [...$form.inspectorActions, { action: '', outcome: '' }];
	}
	function removeItem(arrayName: string, index: number) {
		const array = $form[arrayName];
		if (array && Array.isArray(array)) {
			$form[arrayName] = array.filter((_, i) => i !== index);
		}
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="mt-16 flex justify-center">
	<form method="POST" action={save ? '?/save' : '?/submit'} class="grid grid-cols-[1fr_10fr] gap-4 lg:w-1/2" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />
		<h2 class="col-span-2 text-lg font-bold">Name</h2>
		<input
			name="name"
			class="col-span-2 rounded border border-gray-300 px-2 py-1"
			placeholder="Mirror Mirror"
			aria-invalid={$errors.name ? true : undefined}
			bind:value={$form.name}
			{...$constraints.name}
		/>
		<Error error={$errors.name} />
		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Setting</h2>
		<input
			name="setting"
			class="col-span-2 rounded border border-gray-300 px-2 py-1"
			placeholder="A small town in the english countryside"
			aria-invalid={$errors.setting ? true : undefined}
			bind:value={$form.setting}
			{...$constraints.setting}
		/>
		<Error error={$errors.setting} />
		<hr class="col-span-2 border-slate-900" />

		<h2 class="font-size col-span-2 text-lg font-bold">Murderer</h2>
		<label class="" for="murdererName">Name</label>
		<input
			type="text"
			name="murdererName"
			placeholder="Jane doe"
			aria-invalid={$errors.murdererName ? true : undefined}
			{...$constraints.murdererName}
			bind:value={$form.murdererName}
		/>
		<label for="murdererDescription">Description</label>
		<input
			type="text"
			name="murdererDescription"
			bind:value={$form.murdererDescription}
			{...$constraints.murdererDescription}
			aria-invalid={$errors.murdererDescription ? true : undefined}
		/>
		<label for="murder-reason">Reason</label>
		<textarea
			use:textareaAutosizeAction
			name="murdererReason"
			bind:value={$form.murdererReason}
			{...$constraints.murdererReason}
			aria-invalid={$errors.murdererReason ? true : undefined}
		></textarea>
		<Error error={$errors.murdererName} />

		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Suspects</h2>
		{#each $form.suspects as suspect, index (index)}
			<label for={`suspect-name-${index}`}>Name</label>
			<input
				id={`suspect-name-${index}`}
				data-invalid={$errors.suspects?.[index]?.name}
				bind:value={suspect.name}
				placeholder="Name"
				{...$constraints.suspects.name}
			/>
			<label for={`suspect-description-${index}`}>Description</label>
			<input
				id={`suspect-description-${index}`}
				placeholder="Description"
				bind:value={suspect.description}
				{...$constraints.suspects.description}
			/>
			<Error error={$errors.suspects?.[index]?.name} classes="col-start-2" />
			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('suspects', index)}>Remove Suspect</button>
		{/each}
		<button type="button" class="col-span-2 bg-green-500" on:click={addSuspect}>Add Suspect</button>
		<hr class="col-span-2 border-slate-900" />

		<h2 class="col-span-2 text-lg font-bold">Timeframe</h2>
		{#each $form.events as event, index (index)}
			<label for={`event-time-${index}`}>Time</label>
			<input
				id={`event-time-${index}`}
				bind:value={event.time}
				{...$constraints.events.time}
				class="rounded border border-gray-300 px-2 py-1"
			/>
			<Error error={$errors.events?.[index]?.time} classes="col-start-2" />

			<label for={`event-description-${index}`}>Description</label>
			<input
				id={`event-description-${index}`}
				placeholder="Description"
				bind:value={event.description}
				{...$constraints.events.description}
				class="rounded border border-gray-300 px-2 py-1"
			/>
			<Error error={$errors.events?.[index]?.description} classes="col-start-2" />
			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('events', index)}>Remove Event</button>
		{/each}
		<button type="button" on:click={addEvent} class="4 col-span-2 bg-green-500">Add Event</button>

		<hr class="col-span-2 border-slate-900" />
		<h2 class="col-span-2 text-lg font-bold">Inspector Actions</h2>
		{#each $form.inspectorActions as action, index (index)}
			<label for={`action-action-${index}`}>Action</label>
			<input
				id={`action-action-${index}`}
				placeholder="Action"
				bind:value={action.action}
				{...$constraints.inspectorActions.action}
				class="rounded border border-gray-300 px-2 py-1"
			/>
			<Error error={$errors.inspectorActions?.[index]?.action} classes="col-start-2" />

			<label for={`action-outcome-${index}`}>Outcome</label>
			<input
				id={`action-outcome-${index}`}
				placeholder="Outcome"
				bind:value={action.outcome}
				{...$constraints.inspectorActions.outcome}
				class="rounded border border-gray-300 px-2 py-1"
			/>
			<Error error={$errors.inspectorActions?.[index]?.outcome} classes="col-start-2" />
			<button type="button" class="col-span-2 bg-red-500" on:click={() => removeItem('inspectorActions', index)}>Remove Event</button>
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
