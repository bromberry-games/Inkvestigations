<script>
	import { Button, Card } from 'flowbite-svelte';
	import Pricing from './pricing.svelte';
	import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
	import { convertIsoStringToIcon } from './utils';

	export let data;
</script>

{#if !data.session}
	<div class="p-8 text-center text-4xl">Try for free! No credit card required.</div>
	<div class="text-center">
		<Button color="red" href="/login">Create new account</Button>
	</div>
{/if}

{#each data.oneTimeItems as price}
	<Card>
		<h5 class="mb-4 font-primary text-xl font-medium">{price.product.name}</h5>
		<p>{price.product.metadata.messages_amount} chat messages</p>
		<p>{price.unit_amount / 100} {convertIsoStringToIcon(price.currency)}</p>
		<form action="?/buy" method="POST">
			<input type="hidden" name="price_id" value={price.id} />
			<Button class="bg-quaternary font-primary text-xl" type="submit">Buy now</Button>
		</form>
	</Card>
{/each}

<div class="my-8 mb-56 flex flex-wrap justify-center">
	{#each data.stripeSubscriptions as price}
		<div class="p-8">
			<Pricing
				name={price.product_name}
				amount={price.unit_amount / 100}
				price_id={price.id}
				login={getAuthStatus(data.session) == AuthStatus.LoggedIn}
				daily_messages={price.daily_message_limit}
				currentPlan={price.currentPlan}
				hasSub={data.hasSub}
			></Pricing>
		</div>
	{/each}
</div>
