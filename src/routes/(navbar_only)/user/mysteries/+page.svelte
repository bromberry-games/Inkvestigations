<script>
	import { Badge, Button, Input } from 'flowbite-svelte';

	export let data;
</script>

<div class="flex justify-center bg-tertiary">
	<div class="w-1/2">
		<div class="flex">
			<Input type="text" placeholder="search"></Input>
			<Button class="bg-green-500" href="/user/mysteries/create">New</Button>
		</div>
		<div>
			{#each data.mysteries as mystery}
				<div aria-label="mystery">
					{mystery.name}
					<Badge rounded color="dark">{mystery.published ? 'Published' : 'Draft'}</Badge>
					<form action="?/delete" method="post" class="inline">
						<input type="hidden" name="mystery-name" value={mystery.name} />
						<Button type="submit" class="bg-red-500">Delete</Button>
					</form>
					<Button class="bg-blue-500" href="/user/mysteries/{mystery.name.replace(/\s+/g, '_')}">Edit</Button>
				</div>
			{/each}
		</div>
	</div>
</div>
