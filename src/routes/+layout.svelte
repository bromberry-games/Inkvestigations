<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte'
  import "../app.css";

  import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

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

<Navbar let:hidden let:toggle rounded color="form" class="w-full bg-custom-secondary" navDivClass="mx-auto flex flex-wrap justify-between items-center">
  <NavBrand href="/">
    <img src="/images/police_captain.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-custom-primary">Inkvestigations</span>
  </NavBrand>
  <div class="flex md:order-2">
    {#if session}
      <Button class="bg-custom-primary text-xl hover:scale-110 transform transition-transform" size="lg" on:click={() => supabase.auth.signOut()}>Logout</Button>
    {:else}
      <Button class="bg-custom-primary" size="lg" href="/login" >Login</Button>
    {/if}
    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden}>
    <NavLi href="/mysteries" class="text-custom-primary text-2xl md:mx-8">Mysteries</NavLi>
    <NavLi href="/pricing"class="text-custom-primary text-2xl md:mx-8">Pricing</NavLi>
  </NavUl>
</Navbar>

<slot />