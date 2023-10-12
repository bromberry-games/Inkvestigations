<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte'
  import "../app.css";

  import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

	export let data
  import logo from "/static/images/logo_2.svg?src";

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

<Navbar let:hidden let:toggle class="w-full !bg-custom-secondary"  navDivClass="mx-auto flex flex-wrap justify-between items-center">
  <NavBrand href="/" class="w-1/2">
   <!-- <img src="/images/logo_2.svg" class="mr-3 h-6 sm:h-12" alt="Inkvestigations logo"/>--> 
   <div class="font-tertiary md:w-3/5 inline" id="logo-container">
			{@html logo}
		</div>
  </NavBrand>
  <div class="flex md:order-2">
    {#if session}
      <Button class="bg-custom-primary text-xl hover:scale-110 transform transition-transform" size="lg" on:click={() => supabase.auth.signOut()}>Logout</Button>
    {:else}
      <Button class="bg-custom-primary text-xl hover:scale-110 transform transition-transform" size="lg" href="/login" >Login</Button>
    {/if}
    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden}>
    <NavLi href="/mysteries" class="!text-custom-primary !font-secondary text-4xl md:mx-8">Mysteries</NavLi>
    <NavLi href="/pricing"class="!text-custom-primary !font-secondary text-4xl md:mx-8">Pricing</NavLi>
  </NavUl>
</Navbar>

<slot />