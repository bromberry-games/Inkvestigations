<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
  import "../app.css";
</script>

<Navbar let:hidden let:toggle rounded color="form" class="w-full" navDivClass="mx-auto flex flex-wrap justify-between items-center">
  <NavBrand href="/">
    <img src="/public/police_captain.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Inkvestigations</span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/mysteries">Mysteries</NavLi>
    <NavLi href="/about">About</NavLi>
  </NavUl>
</Navbar>

<slot />