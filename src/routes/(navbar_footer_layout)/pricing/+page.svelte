<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { convertIsoStringToIcon } from './utils';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { SubscriptionBundles } from './bundles';
	import CheckWithText from './CheckWithText.svelte';

	export let data;
	enum PayMode {
		ONE_TIME = 'one_time',
		SUBSCRIPTION = 'subscription'
	}

	let currentView = PayMode.SUBSCRIPTION;
	const highlightedClass = 'bg-quaternary ';
	const unhighlightedClass = 'bg-gray-500 ';
	const sharedClass = 'font-primary text-xl w-full rounded-none';
	function toggleView() {
		currentView = currentView === PayMode.SUBSCRIPTION ? PayMode.ONE_TIME : PayMode.SUBSCRIPTION;
	}
</script>

<div class="mt-4 flex justify-center">
	<div class="flex w-1/3 justify-center gap-2">
		<Button
			class={sharedClass + ' ' + (currentView === PayMode.SUBSCRIPTION ? highlightedClass : unhighlightedClass)}
			type="button"
			on:click={toggleView}>Subscriptions</Button
		>
		<Button class={sharedClass + ' ' + (currentView === PayMode.ONE_TIME ? highlightedClass : unhighlightedClass)} on:click={toggleView}
			>One time</Button
		>
	</div>
</div>

<div class="lg:h-[66vh]">
	{#if currentView === PayMode.ONE_TIME}
		<div class="my-8 mb-96 flex flex-wrap justify-center gap-8 md:gap-16">
			{#each data.oneTimeItems as price}
				<Card>
					<p class="font-primary text-4xl font-bold text-gray-900">{convertIsoStringToIcon(price.currency)}{price.unit_amount / 100}</p>
					<p class="font-primary">
						<span class="inline font-primary text-xl font-bold">{price.product.metadata.messages_amount}</span>
						messages
					</p>
					<form action="?/buy" method="POST" class="mt-4">
						<input type="hidden" name="price_id" value={price.id} />
						<Button class="w-full bg-quaternary font-primary text-xl" type="submit">Buy now</Button>
					</form>
				</Card>
			{/each}
		</div>
	{:else}
		<div class="my-8 flex flex-wrap justify-center gap-16">
			<Card class="flex w-full flex-col justify-between">
				<div>
					<h5 class="mb-4 text-xl font-medium text-gray-500">for free</h5>
					<div class="flex items-baseline text-gray-900">
						<span class="text-3xl font-semibold">$</span>
						<span class="text-5xl font-extrabold tracking-tight">0</span>
						<span class="ms-1 text-xl font-normal text-gray-500">/month +</span>
					</div>
					<span class="text-xl font-normal text-gray-500"
						><span class="text-3xl font-bold text-gray-900">${data.freeTier.unit_amount / 100}</span> per
						<span class="text-3xl font-bold text-gray-700">{data.freeTier.product.metadata.metered_message_refill}</span> messages billed every
						3 months</span
					>
					<ul class="my-7 space-y-4">
						<CheckWithText><span>5 daily messages for free!</span></CheckWithText>
						<CheckWithText><span>Play as many mysteries as you can</span></CheckWithText>
					</ul>
				</div>
				<div class="w-full self-end"></div>
			</Card>
			<Card class="flex w-full flex-col justify-between">
				<div>
					<h5 class="mb-4 text-xl font-medium text-gray-500">Pay as you go</h5>
					<div class="flex items-baseline text-gray-900">
						<span class="text-3xl font-semibold">$</span>
						<span class="text-5xl font-extrabold tracking-tight">0</span>
						<span class="ms-1 text-xl font-normal text-gray-500">/month +</span>
					</div>
					<span class="text-xl font-normal text-gray-500"
						><span class="text-3xl font-bold text-gray-900">${data.freeTier.unit_amount / 100}</span> per
						<span class="text-3xl font-bold text-gray-700">{data.freeTier.product.metadata.metered_message_refill}</span> messages billed every
						3 months</span
					>
					<ul class="my-7 space-y-4">
						<CheckWithText><span>{data.freeTier.product.metadata.daily_messages} daily messages for free</span></CheckWithText>
						<CheckWithText><span>Only $0.03 per message</span></CheckWithText>
						<CheckWithText><span>Play as many mysteries as you can</span></CheckWithText>
					</ul>
				</div>
				<div class="w-full self-end">
					{#if data.subType == SubscriptionBundles.Free}
						<form action="?/subscribe" method="POST">
							<input type="hidden" name="paymode" value={SubscriptionBundles.ZeroDollar} />
							<input type="hidden" name="price-id" value={data.freeTier.id} />
							<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CHOOSE PLAN</Button>
						</form>
					{:else}
						<form action="?/cancel" method="POST">
							<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">
								{#if data.subType == SubscriptionBundles.ZeroDollar}
									CANCEL PLAN
								{:else if data.subType == SubscriptionBundles.NineDollar}
									DOWNGRADE PLAN
								{/if}
							</Button>
						</form>
					{/if}
				</div>
			</Card>

			<Card>
				<h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Premium Mysteries</h5>
				<div class="flex items-baseline text-gray-900 dark:text-white">
					<span class="text-3xl font-semibold">$</span>
					<span class="text-5xl font-extrabold tracking-tight">{data.subTier.mysterySub.unit_amount / 100}</span>
					<span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
				</div>
				<span class="text-xl font-normal text-gray-500"
					><span class="text-3xl font-bold text-gray-900">${data.subTier.payToGo.unit_amount / 100}</span> per
					<span class="text-3xl font-bold text-gray-700">
						{data.subTier.payToGo.product.metadata.metered_message_refill}
					</span> messages billed every month</span
				>
				<ul class="my-7 space-y-4">
					<CheckWithText><span>{data.subTier.mysterySub.product.metadata.daily_messages} daily messages for free</span></CheckWithText>
					<CheckWithText><span>Only $0.02 per message</span></CheckWithText>
					<CheckWithText><span>Access to subscriber only mysteries</span></CheckWithText>
					<CheckWithText><span>Special discord role</span></CheckWithText>
					<CheckWithText><span>New mystery every week</span></CheckWithText>
				</ul>
				{#if data.subType != SubscriptionBundles.NineDollar}
					<form action="?/subscribe" method="POST">
						<input type="hidden" name="paymode" value={SubscriptionBundles.NineDollar} />
						<input type="hidden" name="pay-to-go" value={data.subTier.payToGo.id} />
						<input type="hidden" name="mystery-sub" value={data.subTier.mysterySub.id} />
						<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">
							{#if data.subType == SubscriptionBundles.Free}
								CHOOSE PLAN
							{:else}
								UPGRADE PLAN
							{/if}
						</Button>
					</form>
				{:else}
					<form action="?/cancel" method="POST">
						<Button class="w-full bg-tertiary font-primary font-primary text-xl text-quaternary" type="submit">CANCEL PLAN</Button>
					</form>
				{/if}
			</Card>
		</div>
		<p class="text-center">
			You can use your own <a href="/user/edit" class="text-blue-700">OpenAI</a> Key if you are aware of the risks.
		</p>
	{/if}
</div>
<div class="mb-8 flex justify-center">
	<div class="w-1/2 font-secondary">
		<h2 class="text-3xl font-bold">Questions</h2>
		<p class="text-xl">
			If you have any questions or need help with payments join our <a href="https://discord.gg/t3zTYNhNzp" class="text-blue-700"
				>discord
			</a>or send us a
			<a href="mailto:bromberrygames@pm.me" class="text-blue-700">mail</a>
		</p>
		<h3 class="mt-2 text-3xl font-bold">FAQ</h3>
		<h4 class="text-xl font-bold">- Why pay to go pricing?</h4>
		<p class="text-lg">
			For every message you send we have to pay OpenAi. We think pay to go is the fairest pricing since you only pay for what you use. This
			also allows you to use your own key if you want to and still be able to profit from our subscription.
		</p>
		<h4 class="mt-2 text-xl font-bold">- Why is the free tier only billed every 3 months?</h4>
		<p class="text-lg">
			We pay a flat fee for every transaction. Only charging every 3 months keeps costs for lower and allows us to offer at a cheaper price
		</p>
		<h4 class="mt-2 text-xl font-bold">- Do you offer any discounts?</h4>
		<p class="text-xl">
			Talk to us on our <a href="https://discord.gg/t3zTYNhNzp" class="text-blue-700">discord </a> and we can see what we can do.
		</p>
	</div>
</div>
