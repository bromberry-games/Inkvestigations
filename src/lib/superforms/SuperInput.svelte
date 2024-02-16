<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let form: SuperForm<T, any>;
	export let field: FormPathLeaves<T>;
	export let inputClass: string = '';
	export let errorClass: string = '';
	export let labelName: string = '';
	export let placeholder: string = '';

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label for={field} class="text-xl font-bold capitalize">
	{labelName || field}
</label>
<input
	name={field}
	type="text"
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value}
	{...$constraints}
	{...$$restProps}
	class={inputClass}
	{placeholder}
/>
{#if $errors}<span class={'invalid text-red-500 ' + errorClass}>{$errors}</span>{/if}
