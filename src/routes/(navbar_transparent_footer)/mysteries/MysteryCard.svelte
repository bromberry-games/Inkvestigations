<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { LockSolid } from 'flowbite-svelte-icons';

	export let mystery: unknown;
	export let rating: number;
	export let unlocked: boolean;
</script>

<Card
	img={'/images/mysteries/' + mystery.name.replace(/ /g, '_').toLowerCase() + '.webp'}
	class="rounded border-8 border-quaternary !bg-quaternary"
	padding="none"
	href={unlocked ? mystery.slug : undefined}
>
	<div class="m-4 flex justify-center">
		<div class="flex flex-col justify-between font-primary text-2xl text-tertiary">
			<h5 class="text-center text-xl md:text-2xl xl:text-3xl">
				{mystery.name}
				{#if !unlocked}
					<LockSolid class="inline" />
				{/if}
			</h5>
			<div class="flex justify-center">
				{#each Array(3) as _, index}
					<p class="mx-2 inline text-3xl md:text-4xl">
						{#if index < rating}
							★
						{:else}
							☆
						{/if}
					</p>
				{/each}
			</div>
		</div>
	</div>
</Card>
