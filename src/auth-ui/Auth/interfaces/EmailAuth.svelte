<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Container from '$lib/../auth-ui/UI/Container.svelte';
	import Message from '$lib/../auth-ui/UI/Message.svelte';
	import { VIEWS, type I18nVariables, type ViewType, type RedirectTo } from '@supabase/auth-ui-shared';
	import type { Appearance } from '$lib/types';
	import { Button, Input } from 'flowbite-svelte';

	export let authView: ViewType = 'sign_in';
	export let email = '';
	export let password = '';
	export let supabaseClient: SupabaseClient;
	export let redirectTo: RedirectTo = undefined;
	export let additionalData: { [key: string]: any } | undefined = undefined;
	export let showLinks = false;
	export let magicLink = true;
	export let i18n: I18nVariables;
	export let appearance: Appearance;

	let message = '';
	let error = '';
	let loading = false;

	let lngKey: 'sign_in' | 'sign_up' = authView === 'sign_in' ? 'sign_in' : 'sign_up';

	async function handleSubmit() {
		loading = true;
		error = '';
		message = '';

		switch (authView) {
			case VIEWS.SIGN_IN:
				const { error: signInError } = await supabaseClient.auth.signInWithPassword({
					email,
					password
				});
				if (signInError) error = signInError.message;
				loading = false;
				break;
			case VIEWS.SIGN_UP:
				let options: { emailRedirectTo: RedirectTo; data?: object } = {
					emailRedirectTo: redirectTo
				};
				if (additionalData) {
					options.data = additionalData;
				}
				const {
					data: { user: signUpUser, session: signUpSession },
					error: signUpError
				} = await supabaseClient.auth.signUp({
					email,
					password,
					options
				});

				if (signUpError) error = signUpError.message;
				// Check if session is null -> email confirmation setting is turned on
				else if (signUpUser && !signUpSession) message = i18n.sign_up?.confirmation_text as string;
				break;
		}
		loading = false;
	}
</script>

<form method="post" on:submit|preventDefault={handleSubmit}>
	<!-- <Container direction="vertical" gap="large" {appearance}> -->
	<div class="flex flex-col gap-2">
		<p class="text-center font-secondary text-2xl">Log in with e-mail</p>
		<div>
			<Input
				id="email"
				type="email"
				name="email"
				autofocus
				placeholder={i18n?.[lngKey]?.email_input_placeholder}
				bind:value={email}
				autocomplete="email"
				class="border-gray-600 bg-gray-800 font-secondary text-white"
			/>
		</div>
		<div>
			<Input
				id="password"
				type="password"
				name="password"
				placeholder={i18n?.[lngKey]?.password_input_placeholder}
				bind:value={password}
				autocomplete={authView === VIEWS.SIGN_IN ? 'current-password' : 'new-password'}
				class="border-gray-600 bg-gray-800 font-secondary text-white"
			/>
		</div>
		<slot />
		<div class="flex justify-center">
			<Button type="submit" btnClass="bg-tertiary text-2xl w-2/5 py-4 rounded text-center font-primary">
				{i18n?.[lngKey]?.button_label}
			</Button>
		</div>

		{#if showLinks}
			{#if authView === VIEWS.SIGN_IN && magicLink}
				<a
					on:click={(e) => {
						e.preventDefault();
						authView = VIEWS.MAGIC_LINK;
					}}
					href="#auth-magic-link"
					>{i18n?.magic_link?.link_text}
				</a>
			{/if}
			{#if authView === VIEWS.SIGN_IN}
				<hr class="border-slate-900" />
				<a
					on:click={(e) => {
						e.preventDefault();
						authView = VIEWS.FORGOTTEN_PASSWORD;
					}}
					href="#auth-forgot-password"
					class="text-center font-secondary"
				>
					{i18n?.forgotten_password?.link_text}</a
				>
				<Button
					btnClass="bg-tertiary text-2xl py-4 rounded text-center font-primary"
					on:click={(e) => {
						e.preventDefault();
						authView = VIEWS.SIGN_UP;
					}}
					href="#auth-sign-up"
					{appearance}
				>
					Create new Account
				</Button>
			{:else}
				<a
					on:click={(e) => {
						e.preventDefault();
						authView = VIEWS.SIGN_IN;
					}}
					href="#auth-sign-in"
					class="text-center font-secondary"
				>
					{i18n?.sign_in?.link_text}
				</a>
			{/if}
		{/if}
		<!-- </Container> -->
	</div>

	{#if message}
		<Message {appearance}>
			{message}
		</Message>
	{/if}
	{#if error}
		<Message color="danger" {appearance}>
			{error}
		</Message>
	{/if}
</form>

<style>
	form {
		width: 100%;
	}
</style>
