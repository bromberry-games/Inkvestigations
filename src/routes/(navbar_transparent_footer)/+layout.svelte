<script lang="ts">
	import MyFooter from '$lib/MyFooter.svelte';
	import MyLayout from '$lib/MyLayout.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="sticky top-0 w-full">
	<MyLayout {supabase} {session} />
</div>

<!-- <div class="flex h-full flex-1 justify-center"> -->
<slot />
<!-- </div> -->

<MyFooter></MyFooter>
