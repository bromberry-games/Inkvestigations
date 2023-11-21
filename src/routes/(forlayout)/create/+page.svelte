<script>
	import { textareaAutosizeAction } from 'svelte-legos';

	let setting = '';

	let suspects = [{ name: '', description: '' }];
	let events = [{ time: '', description: '' }];
	let actions = [{ action: '', outcome: '' }];
	let murder = { name: '', description: '', reason: '' };
</script>

<div class="mt-16 flex justify-center">
	<form class="flex w-1/2 flex-col gap-4">
		<div class="flex flex-col gap-2">
			<!-- <label for="setting" class="block">Setting</label> -->
			<h2 class="text-lg font-bold">Setting</h2>
			<input
				id="setting"
				bind:value={setting}
				class="rounded border border-gray-300 px-2 py-1"
				placeholder="A small town in the english countryside"
			/>
		</div>
		<div class="grid grid-cols-[1fr_10fr] gap-4">
			<h2 class="font-size col-span-2 text-lg font-bold">Murderer</h2>
			<label class="row-start-2" for="murder-name">Name</label>
			<input id="murder-name" placeholder="Jane doe" bind:value={murder.name} />
			<label for="murder-description">Description</label>
			<input id="murder-description" bind:value={murder.description} />
			<label for="murder-reason">Reason</label>
			<textarea use:textareaAutosizeAction id="murder-reason" bind:value={murder.reason} />
		</div>

		<h2 class="text-lg font-bold">Suspects</h2>
		{#each suspects as suspect, index (index)}
			<div>
				<label for={`suspect-name-${index}`}>Name</label>
				<input id={`suspect-name-${index}`} placeholder="Name" bind:value={suspect.name} />

				<label for={`suspect-description-${index}`}>Description</label>
				<input id={`suspect-description-${index}`} placeholder="Description" bind:value={suspect.description} />
			</div>
		{/each}
		<button type="button" on:click={() => (suspects = [...suspects, { name: '', description: '' }])}>Add Suspect</button>

		<h2 class="text-lg font-bold">Timeframe</h2>
		{#each events as event, index (index)}
			<div class="flex flex-col gap-2">
				<label for={`event-time-${index}`} class="block">Time</label>
				<input id={`event-time-${index}`} bind:value={event.time} class="rounded border border-gray-300 px-2 py-1" />

				<label for={`event-description-${index}`} class="block">Description</label>
				<input
					id={`event-description-${index}`}
					placeholder="Description"
					bind:value={event.description}
					class="rounded border border-gray-300 px-2 py-1"
				/>
			</div>
		{/each}
		<button
			type="button"
			on:click={() => (events = [...events, { time: '', description: '' }])}
			class="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">Add Event</button
		>

		{#each actions as action, index (index)}
			<div class="flex flex-col gap-2">
				<label for={`action-action-${index}`} class="block">Action</label>
				<input
					id={`action-action-${index}`}
					placeholder="Action"
					bind:value={action.action}
					class="rounded border border-gray-300 px-2 py-1"
				/>

				<label for={`action-outcome-${index}`} class="block">Outcome</label>
				<input
					id={`action-outcome-${index}`}
					placeholder="Outcome"
					bind:value={action.outcome}
					class="rounded border border-gray-300 px-2 py-1"
				/>
			</div>
		{/each}
		<button
			type="button"
			on:click={() => (actions = [...actions, { action: '', outcome: '' }])}
			class="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">Add Action</button
		>

		<button type="submit" class="rounded border border-gray-300 bg-blue-200 px-4 py-2 hover:bg-blue-100">Submit</button>
	</form>
</div>
