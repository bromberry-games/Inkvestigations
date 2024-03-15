<script lang="ts">
	import { getMysteryImagePath } from '$lib/generic-helpers';
	import { Button, Modal } from 'flowbite-svelte';
	import { StarOutline, StarSolid } from 'flowbite-svelte-icons';
	import { elasticOut, sineIn } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let openRatingModal = false;
	export let rating = 0;
	export let mystery: { access_code: string; slug: string; name: string };
	let animArr = Array(0);
	async function startAnim() {
		await new Promise((resolve) => setTimeout(resolve, 400));
		animArr = Array(3);
	}
</script>

<Modal bind:open={openRatingModal} autoclose on:open={() => startAnim()} class="bg-quaternary" size="sm">
	<h1 class="text-center font-secondary text-4xl font-semibold text-tertiary-100">
		{#if rating > 0}
			Solved correctly
		{:else}
			Didn't solve
		{/if}
	</h1>
	<div class="flex justify-center">
		<img src={getMysteryImagePath(mystery)} alt="mystery images" width="150" height="150" class="rounded-xl" />
	</div>
	<div class="flex h-12 justify-center">
		{#each animArr as _, i}
			{#if rating > i}
				<div in:scale|global={{ duration: 1000, delay: 100 + 500 * i, opacity: 0.5, start: 0.1, easing: elasticOut }} class="mx-4">
					<StarSolid size="xl" class="star text-tertiary-300 h-12 w-12" />
				</div>
			{:else}
				<div in:scale|global={{ duration: 400, delay: 500 + 500 * i, opacity: 0.5, start: 0.1, easing: sineIn }} class="mx-4">
					<StarOutline size="xl" class="star text-tertiary-300 h-12 w-12" />
				</div>
			{/if}
		{/each}
	</div>
	<div class="flex justify-center">
		<Button on:click={() => (openRatingModal = false)} class="bg-tertiary-400 font-secondary text-2xl text-quaternary "
			>Read final letter</Button
		>
	</div>
</Modal>
