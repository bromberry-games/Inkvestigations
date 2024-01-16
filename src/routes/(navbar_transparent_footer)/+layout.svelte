<script lang="ts">
	import MyFooter from '$lib/MyFooter.svelte';
	import MyLayout from '$lib/MyLayout.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="sticky top-0 w-full" id="nav">
	<MyLayout {supabase} {session} />
</div>

<!-- <div class="flex h-full flex-1 justify-center"> -->
<slot />

<!-- </div> -->

<!-- <MyFooter></MyFooter> -->

<style>
	#nav {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
	}
</style>
