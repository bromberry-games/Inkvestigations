<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let formAll: SuperForm<T, any>;
	export let field: FormPathLeaves<T>;
	export let array = false;
	export let inputClass: string = '';
	export let errorClass: string = '';
	export let labelName: string = '';
	export let placeholder: string = '';

	const { form } = formAll;
	const { value, errors, constraints } = formFieldProxy(formAll, field);
	$: imageUrl =
		$value == undefined
			? ''
			: $value instanceof File
				? URL.createObjectURL($value)
				: PUBLIC_SUPABASE_URL + '/storage/v1/object/public/user_mysteries/' + $form.id + '/' + $value + '?' + Math.random();
</script>

<div class="col-span-1">
	{#if imageUrl}
		<img src={imageUrl} alt="suspect" />
	{:else}
		<div id="imagePreview">Select thumbnail</div>
	{/if}
</div>
<input
	class="col-span-1 rounded-lg"
	type="file"
	name={field}
	accept="image/png, image/jpeg, image/webp"
	on:input={(e) => ($value = e.currentTarget.files?.item(0) ?? null)}
	{...$constraints}
/>
{#if $errors}<span class={'invalid text-red-500 ' + errorClass}>{$errors}</span>{/if}
