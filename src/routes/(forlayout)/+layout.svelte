<script lang="ts">
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import logo from '/src/images/logo_2.svg?src';
	import MyLayout from '$lib/MyLayout.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="bg-secondary">
	<MyLayout {supabase} {session} />
</div>

<div class="flex h-full flex-1 justify-center">
	<div class="h-full flex-auto bg-tertiary md:w-11/12">
		<slot />
	</div>
</div>
