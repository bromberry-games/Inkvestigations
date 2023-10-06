<script>
	import Pricing from './pricing.svelte';

  export let data;
</script>

<div class="flex justify-center flex-wrap ">

{#each data.prices as price}
<div class="p-8">
  <Pricing name={price.product_name} amount={price.unit_amount / 100} price_id={price.id} >
  </Pricing>  
</div>
{/each}

</div>