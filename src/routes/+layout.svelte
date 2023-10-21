<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Img } from 'flowbite-svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import logo from '/src/images/logo_2.svg?src';
	import { page } from '$app/stores';

	$: activeUrl = $page.url.pathname;
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Navbar let:hidden let:toggle class="sticky top-0 w-full !bg-secondary" navDivClass="mx-auto flex flex-wrap justify-between items-center">
	<NavBrand href="/" class="w-1/2">
		<div class="inline font-tertiary md:w-1/2" id="logo-container">
			{@html logo}
		</div>
	</NavBrand>
	<div class="flex md:order-2">
		{#if session}
			<Button
				class="transform !rounded-full bg-quaternary !px-5 !py-3 font-primary text-xl !text-tertiary transition-transform hover:scale-110"
				on:click={() => supabase.auth.signOut()}>LOGOUT</Button
			>
		{:else}
			<Button
				class="transform !rounded-full bg-quaternary !px-5 !py-3 font-primary text-xl !text-tertiary transition-transform hover:scale-110"
				href="/login">LOGIN</Button
			>
		{/if}
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="font-primary" activeClass="!text-tertiary" on:click={toggle}>
		<NavLi href="/mysteries" class="text-4xl !text-quaternary md:mx-8">MYSTERIES</NavLi>
		<NavLi href="/pricing" class="text-4xl !text-quaternary md:mx-8">PRICING</NavLi>
	</NavUl>
</Navbar>

<div class="flex h-full flex-1 justify-center">
	<div class="h-full flex-auto bg-tertiary md:w-11/12">
		<slot />
	</div>
</div>
