<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Img } from 'flowbite-svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import logo from '/src/images/logo_2.svg?src';
	import { page } from '$app/stores';

	$: activeUrl = $page.url.pathname;
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
