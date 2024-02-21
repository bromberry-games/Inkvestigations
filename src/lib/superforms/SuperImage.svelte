<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let formAll: SuperForm<T, any>;
	export let field: FormPathLeaves<T>;
	export let inputClass: string = '';
	export let errorClass: string = '';
	export let labelName: string = '';
	export let placeholder: string = '';
	let imageUrl = '';
	function handleFileChange(event) {
		console.log('handleFileChange');
		console.log(event);
		const file = event.target.files[0];
		if (file) {
			imageUrl = URL.createObjectURL(file);
		}
	}

	const { form } = formAll;
	console.log($form);
	// const { value, errors, constraints } = formFieldProxy(formAll, field);
</script>

<div class="col-span-1">
	{#if imageUrl}
		<img src={imageUrl} alt="mystery" />
	{:else if $form.mystery.image}
		<img src={'http://localhost:54321/storage/v1/object/public/user_mysteries/' + $form.id + '?' + Math.random()} alt="mystery" />
	{:else}
		<div id="imagePreview">Select thumbnail</div>
	{/if}
</div>
<input
	class="col-span-1"
	type="file"
	name="image"
	accept="image/png, image/jpeg, image/webp"
	on:input={(e) => ($form.mystery.image = e.currentTarget.files?.item(0) ?? null)}
	on:change={handleFileChange}
/>
<!-- {#if $errors}<span class={'invalid text-red-500 ' + errorClass}>{$errors}</span>{/if} -->
