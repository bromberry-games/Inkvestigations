<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	export let login: boolean;
	export let name: String;
	export let price_id: String;
	export let amount: Number;
	export let daily_messages: Number;
	$: amount_string = amount.toLocaleString('en-US', {
		minimumFractionDigits: 2, // Always display at least 2 decimal places
		maximumFractionDigits: 2 // No more than 2 decimal places
	});
</script>

<Card class="!bg-quaternary text-tertiary">
	<h5 class="mb-4 text-xl font-medium">{name}</h5>
	<div class="flex items-baseline">
		<span class="text-3xl font-semibold">$</span>
		<span class="text-5xl font-extrabold tracking-tight">{amount_string}</span>
		<span class="ml-1 text-xl">per month</span>
	</div>
	<h1 class="my-4 mt-4 text-2xl font-semibold">
		{daily_messages} Messages per day
	</h1>
	{#if login}
		<form action="?/buy" method="POST">
			<input type="hidden" name="price_id" value={price_id} />
			<Button class="w-full bg-tertiary font-primary text-xl text-quaternary" type="submit">CHOOSE PLAN</Button>
		</form>
	{:else}
		<Button class="w-full " type="submit" href="/login">Signup to buy</Button>
	{/if}
</Card>
