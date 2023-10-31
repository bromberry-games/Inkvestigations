<script lang="ts">
	import { page } from '$app/stores';
	import {
		Avatar,
		Button,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar
	} from 'flowbite-svelte';
	import logo from '/src/images/logo_2.svg?src';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;
	export let session: Session | null;

	$: activeUrl = $page.url.pathname;
	$: console.log(activeUrl);
	let activeClass =
		'!text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';
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
	<div class="flex items-center md:order-2">
		{#if session}
			<Avatar id="avatar-menu" src="/images/mysteries/police_captain.webp" />
			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownHeader>
					<span class="block truncate text-sm font-medium">name@flowbite.com</span>
				</DropdownHeader>
				<DropdownItem on:click={() => supabase.auth.signOut()}>Sign out</DropdownItem>
			</Dropdown>
		{/if}
		<NavHamburger on:click={toggle} class="!focus:outline-none !bg-transparent" />
	</div>
	<NavUl {hidden} {activeClass} class="justify-end border-none !bg-transparent text-end font-primary" on:click={toggle}>
		<NavLi href="/mysteries" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/mysteries'}>MYSTERIES</NavLi>
		<NavLi href="/pricing" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/pricing'}>PRICING</NavLi>
		{#if !session}
			<NavLi href="/login" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/login'}>LOGIN</NavLi>
		{/if}
	</NavUl>
</Navbar>
