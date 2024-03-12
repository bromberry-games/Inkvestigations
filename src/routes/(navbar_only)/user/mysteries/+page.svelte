<script>
	import { Badge, Button, Input } from 'flowbite-svelte';
	import { FolderPlusOutline } from 'flowbite-svelte-icons';

	export let data;
</script>

{#if data.mysteries && data.mysteries.length > 0}
	<div class="flex h-dvh justify-center bg-tertiary-500">
		<div class="w-11/12 lg:w-1/2">
			<div class="mt-4 flex">
				<Input type="text" placeholder="search"></Input>
				<form action="?/create" method="post" class="inline">
					<Button class="bg-green-500" type="submit">New</Button>
				</form>
			</div>
			<div class="mt-4 flex flex-col gap-4">
				{#each data.mysteries as mystery}
					<div aria-label="mystery" class="bg-tertiary-100 w-full px-4 py-2">
						{mystery.name}
						<Badge rounded color="dark">{mystery.mystery_id != undefined ? 'Published' : 'Draft'}</Badge>
						<form action="?/delete" method="post" class="inline">
							<input type="hidden" name="mystery-id" value={mystery.id} />
							<Button type="submit" class="bg-red-500">Delete</Button>
						</form>
						<Button class="bg-quaternary" href="/user/mysteries/{mystery.id}">Edit</Button>
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
