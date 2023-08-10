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

<Navbar let:hidden let:toggle rounded color="form" class="w-full" navDivClass="mx-auto flex flex-wrap justify-between items-center">
  <NavBrand href="/">
    <img src="/public/police_captain.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Inkvestigations</span>
  </NavBrand>
  <div class="flex md:order-2">
    {#if session}
      <Button color="red" size="sm" on:click={() => supabase.auth.signOut()}>Logout</Button>
    {:else}
      <Button color="red" size="sm" href="/login" >Login</Button>
    {/if}
    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden}>
    <NavLi href="/mysteries">Mysteries</NavLi>
    <NavLi href="/about">About</NavLi>
  </NavUl>
</Navbar>

<slot />