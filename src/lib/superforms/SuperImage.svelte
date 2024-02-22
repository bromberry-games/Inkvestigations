<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let formAll: SuperForm<T, any>;
	export let field: FormPathLeaves<T>;
	export let array = false;
	export let inputClass: string = '';
	export let errorClass: string = '';
	export let labelName: string = '';
	export let placeholder: string = '';
	let imageUrl = '';
	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			imageUrl = URL.createObjectURL(file);
		}
	}

	const { form } = formAll;
	$: [first, second] = field.split('.');
	const { value, errors, constraints } = formFieldProxy(formAll, field);
	// $: console.log($form['suspects']?.[0]['image']);
	// function setImage(e) {
	// const file = e.target.files[0];
	// if (array) {
	// const matches = field.match(/(\w+)(\[\d+\]).(\w+)/);
	// if (matches?.length != 3) {
	// throw new Error('Field is not an image field');
	// }
	// const [first, second, third] = matches;
	// $form[first][second][third] = file ?? null;
	// }
	// }
	console.log($value);
</script>

<div class="col-span-1">
	{#if imageUrl}
		<img src={imageUrl} alt="mystery" />
	{:else if $value == 'image'}
		<img
			src={'http://localhost:54321/storage/v1/object/public/user_mysteries/' +
				$form.id +
				'/' +
				field.replace('[', '').replace(']', '') +
				'?' +
				Math.random()}
			alt="mystery"
		/>
	{:else}
		<div id="imagePreview">Select thumbnail</div>
	{/if}
</div>
<input
	class="col-span-1"
	type="file"
	name={field}
	accept="image/png, image/jpeg, image/webp"
	on:input={(e) => ($value = e.currentTarget.files?.item(0) ?? null)}
	on:change={handleFileChange}
	{...$constraints}
/>
{#if $errors}<span class={'invalid text-red-500 ' + errorClass}>{$errors}</span>{/if}
