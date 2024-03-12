<script>
	import { Badge, Button, Input, Modal } from 'flowbite-svelte';
	import { FolderPlusOutline } from 'flowbite-svelte-icons';

	export let data;
	let toDelete = '';
	let openToDelete = false;
</script>

<Modal size="xs" title="Delete mystery" bind:open={openToDelete} autoclose={false} outsideclose>
	<p>Are you sure you want to delete this mystery? This action cannot be undone.</p>
	<svelte:fragment slot="footer">
		<div class="flex w-full !justify-end">
			<Button class="text-gray-500" on:click={() => (openToDelete = false)}>Cancel</Button>
			<form action="?/delete" method="post" class="inline">
				<input type="hidden" name="mystery-id" value={toDelete} />
				<Button type="submit" class="bg-red-500 text-gray-50">Delete</Button>
			</form>
		</div>
	</svelte:fragment>
</Modal>
{#if data.mysteries && data.mysteries.length > 0}
	<div class="flex h-dvh justify-center bg-tertiary-500">
		<div class="w-11/12 lg:w-1/2 xl:w-[50rem]">
			<div class="mt-4 flex">
				<Input type="text" placeholder="search" class="mr-2"></Input>
				<form action="?/create" method="post" class="inline">
					<Button class="bg-quaternary" type="submit">New</Button>
				</form>
			</div>
			<div class="mt-4 flex flex-col gap-4">
				{#each data.mysteries as mystery}
					<div aria-label="mystery" class="w-full rounded bg-tertiary-100 px-4 py-2">
						<Badge rounded color="dark">{mystery.mystery_id != undefined ? 'Published' : 'Draft'}</Badge>
						{mystery.name || 'Untitled mystery'}
						<Button
							type="submit"
							class="bg-tertiary-300 text-gray-700"
							on:click={() => {
								toDelete = mystery.id;
								openToDelete = true;
							}}>Delete</Button
						>
						<Button class="text-md bg-quaternary" href="/user/mysteries/{mystery.id}">Edit</Button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-dvh bg-tertiary-500 lg:justify-center">
		<div class="mx-4 w-full pt-8 lg:w-1/2">
			<h1 class="font-secondary text-4xl font-medium text-quaternary">Create a mystery</h1>
			<h2 class="mb-8 font-secondary text-xl font-medium text-gray-500">
				Make your own unique mystery in a few minutes, then play it and share it with your friends.
			</h2>
			<form action="?/create" method="post" class="inline">
				<Button class="bg-quaternary font-primary text-2xl font-medium text-gray-200" type="submit">CREATE NEW</Button>
			</form>
		</div>
	</div>
{/if}
