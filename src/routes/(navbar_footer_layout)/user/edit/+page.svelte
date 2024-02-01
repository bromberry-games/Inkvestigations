<script lang="ts">
	import { Button, Checkbox, Input, Modal } from 'flowbite-svelte';
	import { formFieldProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import type { Writable } from 'svelte/store';

	export let data: PageData;
	const { form, errors, constraints, enhance, message } = superForm(data.form);


	let clickOutsideModal = false;

</script>

{#if data.activeSub}
	<Modal title="Delete account" bind:open={clickOutsideModal} autoclose={false} outsideclose>
		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			You have an active subscription. Cancel it first to be able to delete your account.
		</p>
		<svelte:fragment slot="footer">
			<form method="POST" action="/pricing?/cancel">
				<Button type="submit" class="bg-red-500">Cancel subscription</Button>
			</form>
		</svelte:fragment>
	</Modal>
{:else}
	<Modal title="Delete account" bind:open={clickOutsideModal} autoclose={false} outsideclose>
		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
		</p>
		<svelte:fragment slot="footer">
			<form method="POST" action="?/delete">
				<Button type="submit" class="bg-red-500">Delete my account and all account data</Button>
			</form>
		</svelte:fragment>
	</Modal>
{/if}

<div class="flex justify-center">
	<div class="md:w-1/4">
		<form use:enhance method="POST" action="?/save">
			<div class="my-4 flex items-center">
				<label for="email" class="mr-2">Email</label>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					aria-invalid={$errors.email ? true : undefined}
					bind:value={$form.email}
					{...$constraints.email}
					id="email"
					autocomplete="email"
				/>
			</div>
			<div class="my-4 flex items-center">
				<label for="useMyOwnToken" class="mr-2">Use my own openai token</label>
				<input type="checkbox" name="useMyOwnToken" id="useMyOwnToken" bind:checked={$form.useMyOwnToken} />
			</div>
			{#if $message}
				<p class="text-green-500">{$message}</p>
			{/if}
			<Button class="mb-4 w-full bg-blue-500" type="submit">Save</Button>
		</form>

		<Button on:click={() => (clickOutsideModal = true)} class="w-full bg-red-500">Delete my account</Button>
	</div>
</div>
