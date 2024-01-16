<script>
	import { Button, Card } from 'flowbite-svelte';
	import Pricing from './pricing.svelte';
	import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
	import { convertIsoStringToIcon } from './utils';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { SubscriptionBundles } from './bundles';

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
<div class="my-8 mb-56 flex justify-center">
	<Card padding="xl">
		<h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Pay as you go</h5>
		<div class="flex items-baseline text-gray-900 dark:text-white">
			<span class="text-3xl font-semibold">$</span>
			<span class="text-5xl font-extrabold tracking-tight">0</span>
			<span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
		</div>
		<span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">+$0.80 per 20 messages billed every 3 months</span>
		<ul class="my-7 space-y-4">
			<li class="flex space-x-2 rtl:space-x-reverse">
				<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
				<span class="font-secondary text-xl font-normal leading-tight text-gray-500">5 daily messages for free</span>
			</li>
			<li class="flex space-x-2 rtl:space-x-reverse">
				<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
				<span class="font-secondary text-xl font-normal leading-tight text-gray-500">Only $0.04 per message</span>
			</li>
		</ul>
		{#if data.subType == SubscriptionBundles.Free}
		<form action="?/subscribe" method="POST">
			<input type="hidden" name="paymode" value={SubscriptionBundles.ZeroDollar} />
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CHOOSE PLAN</Button>
		</form>
		{:else if data.subType == SubscriptionBundles.ZeroDollar}
		<form action="?/cancel" method="POST">
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CANCEL PLAN</Button>
		</form>
		{:else if data.subType == SubscriptionBundles.NineDollar}
		<form action="?/cancel" method="POST">
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">DOWNGRADE PLAN</Button>
		</form>
		{/if}
	</Card>
	<Card>
		<h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Premium Mysteries</h5>
		<div class="flex items-baseline text-gray-900 dark:text-white">
			<span class="text-3xl font-semibold">$</span>
			<span class="text-5xl font-extrabold tracking-tight">9</span>
			<span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
		</div>
		<span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">+$0.50 per 20 messages billed monthly</span>
		<ul class="my-7 space-y-4">
			<li class="flex space-x-2 rtl:space-x-reverse">
				<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
				<span class="font-secondary text-xl font-normal leading-tight text-gray-500">10 daily messages for free</span>
			</li>
			<li class="flex space-x-2 rtl:space-x-reverse">
				<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
				<span class="font-secondary text-xl font-normal leading-tight text-gray-500">Only $0.025 per message</span>
			</li>
			<li class="flex space-x-2 rtl:space-x-reverse">
				<CheckCircleSolid class="text-primary-600 h-4 w-4" color="green" />
				<span class="font-secondary text-xl font-normal leading-tight text-gray-500">All subscriber only mysteries</span>
			</li>
		</ul>
		{#if data.subType == SubscriptionBundles.Free}
		<form action="?/subscribe" method="POST">
			<input type="hidden" name="paymode" value={SubscriptionBundles.NineDollar} />
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CHOOSE PLAN</Button>
		</form>
		{:else if data.subType == SubscriptionBundles.NineDollar}	
		<form action="?/cancel" method="POST">
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CANCEL PLAN</Button>
		</form>
		{:else if data.subType == SubscriptionBundles.ZeroDollar}
		<form action="?/subscribe" method="POST">
			<input type="hidden" name="paymode" value={SubscriptionBundles.NineDollar} />
			<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">UPGRADE PLAN</Button>
		</form>
		{/if}
	</Card>
</div>
