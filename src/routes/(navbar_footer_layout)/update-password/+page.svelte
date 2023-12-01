<script lang="ts">
	//import { Auth } from '@supabase/auth-ui-svelte';
	import Auth from '$lib/../auth-ui/Auth/Auth.svelte';
	import { ThemeSupa, type SocialLayout, type ViewType } from '@supabase/auth-ui-shared';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

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
	let borderRadius = radii[0];
	let view = views[4];

	let gotoHome: boolean = false;

	onMount(() => {
		gotoHome = false;
		data.supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'USER_UPDATED' && session) {
				gotoHome = true;
			}
		});
	});

	$: {
		if (gotoHome) {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Auth UI Svelte</title>
</svelte:head>

<div class="flex justify-center">
	<div class="my-8 rounded-lg bg-secondary p-4">
		<Auth
			supabaseClient={data.supabase}
			theme="dark"
			view={view.id}
			showLinks={false}
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
		/>
	</div>
</div>
