<script lang="ts">
	import { page } from '$app/stores';
	import { updateMessageCounter, messageAmountStore } from '$misc/stores';
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
	import Logo from '/src/images/logo_2.svg?component';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { AuthStatus, getAuthStatus } from './auth-helper';
	import NavContainer from 'flowbite-svelte/NavContainer.svelte';
	import { onMount } from 'svelte';

	export let supabase: SupabaseClient;
	export let session: Session | null;
	$: authStatus = getAuthStatus(session);
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'!text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';

	onMount(() => {
		if (authStatus != AuthStatus.LoggedOut) {
			updateMessageCounter(supabase, session?.user.id);
		}
	});
</script>

<Navbar let:hidden let:toggle let:NavContainer class="sticky top-0 w-full !bg-transparent " id="nav">
	<NavContainer class="mx-auto flex flex-wrap items-center justify-between">
		<NavBrand href={authStatus == AuthStatus.LoggedIn ? '/home' : '/'} class="sm:1/6 md:1/4 xl:w-1/2">
			<Logo class="h-16 w-40 font-tertiary md:w-60 lg:w-80"></Logo>
		</NavBrand>
		<div class="flex items-center md:order-2">
			{#if authStatus == AuthStatus.LoggedIn}
				<div class="flex items-center rounded-full bg-quaternary">
					<Avatar id="avatar-menu" src="/images/mysteries/police_captain.webp" class="cursor-pointer" />
					<div data-testid="message-counter" class="mx-3 font-primary text-2xl text-tertiary">{$messageAmountStore}</div>
				</div>
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
						<span class="block truncate text-sm font-medium">{session.user.email}</span>
					</DropdownHeader>
					<form action="/pricing?/cancel" method="POST">
						<DropdownItem type="submit">Payments</DropdownItem>
					</form>
					<DropdownItem type="submit" href="/user/edit">Edit profile</DropdownItem>
					<DropdownDivider></DropdownDivider>
					<DropdownItem type="submit" on:click={() => supabase.auth.signOut()}>Sign out</DropdownItem>
				</Dropdown>
			{/if}
			<NavHamburger on:click={toggle} class="!focus:outline-none !bg-transparent" />
		</div>
		<NavUl
			{hidden}
			{activeClass}
			class="ml-0 justify-end border-none !bg-transparent text-end font-primary lg:ml-8 2xl:ml-24"
			on:click={toggle}
		>
			<NavLi href="/mysteries" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/mysteries'}>MYSTERIES</NavLi>
			<NavLi href="/pricing" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/pricing'}>PRICING</NavLi>
			{#if authStatus != AuthStatus.LoggedIn}
				<NavLi href="/login" class="ml-8 text-4xl !text-quaternary" active={activeUrl === '/login'}>LOGIN</NavLi>
			{/if}
		</NavUl>
	</NavContainer>
</Navbar>
