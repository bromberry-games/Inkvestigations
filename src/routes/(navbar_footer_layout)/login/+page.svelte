<script lang="ts">
	//import { Auth } from '@supabase/auth-ui-svelte';
	import Auth from '$lib/../auth-ui/Auth/Auth.svelte';
	import { ThemeSupa, type SocialLayout, type ViewType } from '@supabase/auth-ui-shared';
	import { goto } from '$app/navigation';
	import logo from '/src/images/logo_2.svg?src';
	import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
	import { onMount } from 'svelte';

	export let data;

	const colors = ['rgb(202, 37, 37)', 'rgb(65, 163, 35)', 'rgb(8, 107, 177)', 'rgb(235, 115, 29)'] as const;

	const socialAlignments = ['horizontal', 'vertical'] as const;

	const radii = ['5px', '10px', '20px'] as const;

	const views: { id: ViewType; title: string }[] = [
		{ id: 'sign_in', title: 'Sign In' },
		{ id: 'sign_up', title: 'Sign Up' },
		{ id: 'magic_link', title: 'Magic Link' },
		{ id: 'forgotten_password', title: 'Forgotten Password' },
		{ id: 'update_password', title: 'Update Password' },
		{ id: 'verify_otp', title: 'Verify Otp' }
	];

	let brandColor = colors[0];
	let socialLayout = socialAlignments[1] satisfies SocialLayout;
	let borderRadius = radii[0];
	let view = views[0];


	$: if (data.session) {
		const authStatus = getAuthStatus(data.session);
		if (authStatus == AuthStatus.LoggedIn) {
			goto('/');
		} else if (authStatus == AuthStatus.AnonymousLogin) {
			view = views[1];
		}
	}

</script>

<svelte:head>
	<title>Auth UI Svelte</title>
</svelte:head>

<div class="dark:bg-scale-200 bg-scale-100 relative py-2">
	<div class="gap container relative mx-auto grid grid-cols-12 px-6 pt-8 md:gap-16 lg:gap-16">
		<div class="relative col-span-12 mb-16 md:col-start-5 md:col-end-9 lg:col-start-4 lg:col-end-10">
			<div class="relative rounded-lg bg-secondary lg:mx-auto lg:max-w-md">
				<div>
					<div class="border-scale-400 bg-scale-300 relative rounded-xl px-8 pb-8 pt-4 drop-shadow-sm">
						<div class="mb-6 flex flex-col">
							<div class="flex items-center gap-3 font-tertiary">
								{@html logo}
							</div>
							<p class="text-auth-widget-test text-center font-secondary text-2xl">Sign in with existing account</p>
						</div>
						<Auth
							supabaseClient={data.supabase}
							theme="dark"
							view={view.id}
							appearance={{
								theme: ThemeSupa,
								style: {
									button: `border-radius: ${borderRadius}; border-color: rgba(0,0,0,0);`
								},
								variables: {
									default: {
										colors: {
											brand: brandColor,
											brandAccent: `gray`
										},
										radii: {
											borderRadiusButton: borderRadius,
											buttonBorderRadius: borderRadius,
											inputBorderRadius: borderRadius
										}
									}
								}
							}}
							providers={['apple', 'google', 'facebook']}
							{socialLayout}
							redirectTo={`${data.url}/auth/callback?next=/mysteries`}
							forgottenPasswordRedirect={`${data.url}/auth/callback?next=/update-password`}
							oldUserId={data.session && data.session.user.user_metadata.anonymous == true ? data.session.user.id : undefined}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
