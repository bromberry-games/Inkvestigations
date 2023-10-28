<script lang="ts">
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import logo from '/src/images/logo_2.svg?src';
	import type { Session } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;
	export let session: Session | null;
</script>

<Navbar
	let:hidden
	let:toggle
	class="sticky top-0 w-full !bg-transparent"
	id="nav"
	navDivClass="mx-auto flex flex-wrap justify-between items-center"
>
	<NavBrand href="/" class="w-1/2">
		<div class="inline font-tertiary md:w-1/2" id="logo-container">
			{@html logo}
		</div>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {hidden} class="justify-end text-end font-primary" activeClass="!text-tertiary" on:click={toggle}>
		<NavLi href="/mysteries" class="ml-8 text-4xl !text-quaternary">MYSTERIES</NavLi>
		<NavLi href="/pricing" class="ml-8 text-4xl !text-quaternary">PRICING</NavLi>
		{#if session}
			<Button
				class="transform !rounded-full bg-quaternary !px-5 !py-3 font-primary text-xl !text-tertiary transition-transform hover:scale-110"
				on:click={() => supabase.auth.signOut()}>LOGOUT</Button
			>
		{:else}
			<NavLi href="/login" class="ml-8 text-4xl !text-quaternary">LOGIN</NavLi>
		{/if}
	</NavUl>
</Navbar>
