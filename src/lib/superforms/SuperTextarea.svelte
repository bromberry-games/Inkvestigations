<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { textareaAutosizeAction } from 'svelte-legos';

	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let form: SuperForm<T, any>;
	export let field: FormPathLeaves<T>;
	export let inputClass: string = '';
	export let errorClass: string = '';
	export let labelName: string = '';
	export let placeholder: string = '';

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label for={field} class="text-md mt-2 font-bold capitalize">
	{labelName || field}
</label>
<textarea
	name={field}
	id={field}
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value}
	{...$constraints}
	{...$$restProps}
	class={inputClass}
	{placeholder}
	use:textareaAutosizeAction
/>
{#if $errors}<span class={'invalid text-red-500 ' + errorClass}>{$errors}</span>{/if}
