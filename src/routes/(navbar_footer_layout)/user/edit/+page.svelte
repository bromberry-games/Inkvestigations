<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<div>
	<form use:enhance method="POST" action="?/save">
		<Input
			type="email"
			name="email"
			placeholder="Email"
			aria-invalid={$errors.email ? true : undefined}
			bind:value={$form.email}
			{...$constraints.email}
		/>
		<Button type="submit">Save</Button>
	</form>

	<form method="POST" action="?/delete">
		<Button type="submit" class="bg-red-500">Delete User</Button>
	</form>
</div>
