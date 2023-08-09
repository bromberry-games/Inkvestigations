<script>
	import { createNewChat } from "$misc/shared";
	import { chatStore } from "$misc/stores";
  import { Card, Button,  } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { each } from "svelte/internal";

  onMount(() => {
    $chatStore = {} 
  });

  export let data;

</script>
<div class="p-4 w-full flex">
  {#each data.shopItems as shopItem}
    <div class="p-4">
      <Card img="/public/police_captain.png">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{shopItem.mystery.name}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {shopItem.mystery.description}
        </p>
        {#if shopItem.bought}
          <Button color="dark" on:click={() => createNewChat()}>Play</Button>
        {:else}
        <form action="/api/create-checkout-session" method="POST">
          <Button color="dark" type="submit" id="checkout-button">Buy 3€</Button>
        </form>
        {/if}
      </Card>
    </div>
  {/each}

</div>