<script>
	import { Button } from 'flowbite-svelte';
	import Pricing from './pricing.svelte';

  export let data;
</script>

{#if !data.session}
<div class="p-8 text-center text-4xl">
  Try for free! No credit card required.
</div>
<div class="text-center">
  <Button color="red" href="/login">
    Create new account
  </Button>
</div>
{/if}

<div class="flex justify-center flex-wrap my-8 mb-56">
{#each data.prices as price}
<div class="p-8">
  <Pricing name={price.product_name} amount={price.unit_amount / 100} price_id={price.id} login={data.session != null}>
  </Pricing>  
</div>
{/each}
</div>