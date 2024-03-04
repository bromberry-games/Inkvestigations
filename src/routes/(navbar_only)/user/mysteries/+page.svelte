<script>
	import { Badge, Button, Input } from 'flowbite-svelte';

	export let data;
</script>

<div class="flex h-dvh justify-center bg-tertiary">
	<div class="w-1/2">
		<div class="mt-4 flex">
			<Input type="text" placeholder="search"></Input>
			<form action="?/create" method="post" class="inline">
				<Button class="bg-green-500" type="submit">New</Button>
			</form>
		</div>
		<div>
			{#each data.mysteries as mystery}
				<div aria-label="mystery">
					{mystery.name}
					<Badge rounded color="dark">{mystery.mystery_id != undefined ? 'Published' : 'Draft'}</Badge>
					<form action="?/delete" method="post" class="inline">
						<input type="hidden" name="mystery-id" value={mystery.id} />
						<Button type="submit" class="bg-red-500">Delete</Button>
					</form>
					<Button class="bg-blue-500" href="/user/mysteries/{mystery.id}">Edit</Button>
				</div>
			{/each}
		</div>
	</div>
</div>
