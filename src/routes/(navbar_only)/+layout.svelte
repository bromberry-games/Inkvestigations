<script lang="ts">
	import MyFooter from '$lib/MyFooter.svelte';
	import MyLayout from '$lib/MyLayout.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="sticky top-0 w-full !bg-secondary">
	<MyLayout {supabase} {session} />
</div>

<div class="flex h-full flex-1 justify-center">
	<div class="h-full flex-auto bg-tertiary md:w-11/12">
		<slot />
	</div>
</div>
