<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Container from '$lib/../auth-ui/UI/Container.svelte';
	import Message from '$lib/../auth-ui/UI/Message.svelte';
	import { VIEWS, type I18nVariables, type ViewType } from '@supabase/auth-ui-shared';
	import type { Appearance } from '$lib/types';
	import { Button, Input } from 'flowbite-svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	export let i18n: I18nVariables;
	export let supabaseClient: SupabaseClient;
	export let authView: ViewType;
	export let redirectTo: string | undefined = undefined;
	export let email = '';
	export let showLinks = false;
	export let appearance: Appearance;

	let message = '';
	let error = '';
	let loading = false;
	let captchaToken = '';

	async function handleSubmit() {
		loading = true;
		error = '';
		message = '';
		const { error: resetPasswordError } = await supabaseClient.auth.resetPasswordForEmail(email, {
			redirectTo,
			captchaToken
		});
		if (resetPasswordError) error = resetPasswordError.message;
		else message = i18n.forgotten_password?.confirmation_text as string;
		loading = false;
	}
</script>

<form id="auth-forgot-password" method="post" on:submit|preventDefault={handleSubmit}>
	<Container direction="vertical" gap="large" {appearance}>
		<Container direction="vertical" gap="large" {appearance}>
			<div>
				<Input
					id="email"
					type="email"
					name="email"
					autofocus
					placeholder={i18n?.forgotten_password?.email_input_placeholder}
					bind:value={email}
					autocomplete="email"
					class="border-gray-600 bg-gray-800 font-secondary text-white"
				/>
			</div>
			<Turnstile on:turnstile-callback={(e) => (captchaToken = e.detail.token)} siteKey={PUBLIC_TURNSTILE_SITE_KEY} />
			<Button type="submit" class="bg-tertiary-400 rounded py-4 font-primary text-xl text-quaternary">
				{i18n?.forgotten_password?.button_label}
			</Button>
		</Container>

		{#if showLinks}
			<a
				on:click={(e) => {
					e.preventDefault();
					authView = VIEWS.SIGN_IN;
				}}
				href="#auth-magic-link"
				class="text-center font-secondary"
				>{i18n?.sign_in?.link_text}
			</a>
		{/if}
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
	</Container>
</form>

<style>
	form {
		width: 100%;
	}
</style>
