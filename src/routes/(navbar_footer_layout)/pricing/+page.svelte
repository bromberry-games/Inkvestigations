<script>
	import { Button } from 'flowbite-svelte';
	import Pricing from './pricing.svelte';
	import { AuthStatus, getAuthStatus } from '$lib/auth-helper';

	export let data;
</script>

{#if !data.session}
	<div class="p-8 text-center text-4xl">Try for free! No credit card required.</div>
	<div class="text-center">
		<Button color="red" href="/login">Create new account</Button>
	</div>
{/if}

<div class="my-8 mb-56 flex flex-wrap justify-center">
	{#each data.prices as price}
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
