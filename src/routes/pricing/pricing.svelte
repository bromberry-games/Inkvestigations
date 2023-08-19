<script lang="ts">
    import { Card, Button } from 'flowbite-svelte';
    import { Icon } from 'flowbite-svelte-icons';

    export let name: String;
    export let price_id: String;
    export let amount: Number;
    $: amount_string = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,  // Always display at least 2 decimal places
        maximumFractionDigits: 2   // No more than 2 decimal places
    });

</script>


<Card padding="xl">
  <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{name}</h5>
  <div class="flex items-baseline text-gray-900 dark:text-white">
    <span class="text-3xl font-semibold">$</span>
    <span class="text-5xl font-extrabold tracking-tight">{amount_string}</span>
    <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">per month</span>
  </div>
  <!-- List -->
  <ul class="my-7 space-y-4">
    <li class="flex space-x-2">
      <Icon name="check-circle-solid" class="w-4 h-4 text-primary-600 dark:text-primary-500" />
      <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Normal mysteries playable </span>
    </li>
    <li class="flex space-x-2">
      <Icon name="check-circle-solid" class="w-4 h-4 text-primary-600 dark:text-primary-500" />
      <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Mysteries storage </span>
    </li>
    <li class="flex space-x-2">
      <Icon name="check-circle-solid" class="w-4 h-4 text-primary-600 dark:text-primary-500" />
      <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Integration help </span>
    </li>
    <li class="flex space-x-2 line-through decoration-gray-500">
      <Icon name="check-circle-solid" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
      <span class="text-base font-normal leading-tight text-gray-500">Subscriber only mysteries</span>
    </li>
  </ul>
    <form action="?/buy" method="POST">
        <input type="hidden" name="price_id" value={price_id}>
        <Button class="w-full" color="red" type="submit">Choose plan</Button>
    </form>
</Card>