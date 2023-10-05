<script lang="ts">
  import { Card, Button,  } from "flowbite-svelte";

  export let data;
</script>


<h1>{data.amount}</h1>
<div class="p-4 w-full flex">
  {#each data.mysteries as mystery}
    <div class="p-4">
      <Card img="/images/deadly_diner.webp">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{mystery.name}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {mystery.description}
        </p>
        {#if data.amount > 0}
          <Button color="dark" href={mystery.name.replace(/\s+/g, '_')}> Play</Button>
        {:else}
        <form action="/api/create-checkout-session" method="POST">
          <Button color="dark" type="submit" id="checkout-button">Buy 3€</Button>
        </form>
        {/if}
      </Card>
    </div>
  {/each}

</div>