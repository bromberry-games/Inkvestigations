<script lang="ts">
	//import { Auth } from '@supabase/auth-ui-svelte';
	import  Auth  from '$lib/../auth-ui/Auth/Auth.svelte';
	import { ThemeSupa, type SocialLayout, type ViewType } from '@supabase/auth-ui-shared';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

    export let data;

	const colors = [
		'rgb(202, 37, 37)',
		'rgb(65, 163, 35)',
		'rgb(8, 107, 177)',
		'rgb(235, 115, 29)'
	] as const;

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

	let gotoHome: boolean = false;

	onMount(() => {
		gotoHome = false;
		data.supabase.auth.onAuthStateChange((event, session) => {
        	if (event === 'SIGNED_IN' && session) {
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

<div class="dark:bg-scale-200 bg-scale-100 relative py-2">
	<div
		class="gap container relative mx-auto grid grid-cols-12 px-6 md:gap-16 lg:gap-16 pt-8"
	>
	    <div class="relative col-span-12 mb-16 md:col-start-5 md:col-end-9 lg:col-start-4 lg:col-end-10">
			<div class="relative lg:mx-auto lg:max-w-md bg-custom-secondary rounded-lg">
				<div >
					<div class="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-8 drop-shadow-sm">
						<div class="mb-6 flex flex-col">
							<div class="flex items-center gap-3">
								<img src="/images/logo_2.svg" class="scale-90" alt="Inkvestigations logo"/>
							</div>
							<p class="text-auth-widget-test text-center text-2xl font-secondary">Sign in with existing account</p>
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
                            redirectTo={`${data.url}/auth/callback`}
							forgottenPasswordRedirect={`${data.url}/auth/callback?next=/update-password`}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
