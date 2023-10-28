<script lang="ts">
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import logo from '/src/images/logo_2.svg?src';
	import type { Session } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;
	export let session: Session | null;
</script>

<Navbar let:hidden let:toggle class="sticky top-0 w-full !bg-transparent" navDivClass="mx-auto flex flex-wrap justify-between items-center">
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
			<!-- <Button
				class="transform !rounded-full bg-quaternary !px-5 !py-3 font-primary text-xl !text-tertiary transition-transform hover:scale-110"
				href="/login">LOGIN</Button
			> -->
		{/if}
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="font-primary" activeClass="!text-tertiary" on:click={toggle}>
		<NavLi href="/mysteries" class="text-4xl !text-quaternary md:mx-8">MYSTERIES</NavLi>
		<NavLi href="/pricing" class="text-4xl !text-quaternary md:mx-8">PRICING</NavLi>
		{#if !session}
			<NavLi href="/login" class="text-4xl !text-quaternary md:mx-8">LOGIN</NavLi>
		{/if}
	</NavUl>
</Navbar>
