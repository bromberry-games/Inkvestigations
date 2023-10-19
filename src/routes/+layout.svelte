<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Img } from 'flowbite-svelte'
  import "../app.css";
  import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
  import logo from "/src/images/logo_2.svg?src";
	import { page } from '$app/stores';

  $: activeUrl = $page.url.pathname;
	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})

</script>

<Navbar let:hidden let:toggle class="w-full !bg-secondary sticky top-0"  navDivClass="mx-auto flex flex-wrap justify-between items-center">
  <NavBrand href="/" class="w-1/2">
   <div class="font-tertiary md:w-1/2 inline" id="logo-container">
			{@html logo}
		</div>
  </NavBrand>
  <div class="flex md:order-2">
    {#if session}
        <Button class="bg-quaternary text-xl hover:scale-110 transform font-primary !px-5 !py-3 transition-transform !rounded-full !text-tertiary"  on:click={() => supabase.auth.signOut()}>LOGOUT</Button> 
    {:else}
        <Button class="bg-quaternary text-xl hover:scale-110 transform font-primary !px-5 !py-3 transition-transform !rounded-full !text-tertiary" href="/login">LOGIN</Button> 
    {/if}
    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden}  class="font-primary" activeClass="!text-tertiary" on:click={toggle}>
    <NavLi href="/mysteries" class="!text-quaternary text-4xl md:mx-8">MYSTERIES</NavLi>
    <NavLi href="/pricing"class="!text-quaternary text-4xl md:mx-8">PRICING</NavLi>
  </NavUl>
</Navbar>

<div class="flex justify-center h-full flex-1">
  <div class="md:w-11/12 bg-tertiary h-full">
    <slot />
  </div>
</div>