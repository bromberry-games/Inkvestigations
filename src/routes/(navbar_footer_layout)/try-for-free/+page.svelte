<script lang="ts">
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
	import { goto } from '$app/navigation';

	export let data;
	function signInTempUser(e: CustomEvent) {
		data.supabase.auth.signInWithPassword({
			email: data.user.mail,
			password: data.user.password,
			options: {
				captchaToken: e.detail.token
			}
		});
	}
	$: if (getAuthStatus(data.session) == AuthStatus.AnonymousLogin) {
		goto('/Forced_Farewell');
	}
</script>

{#if data.session}
	<div>login</div>
{:else}
	<div>
		<Turnstile on:turnstile-callback={signInTempUser} siteKey={PUBLIC_TURNSTILE_SITE_KEY} />
	</div>
{/if}
