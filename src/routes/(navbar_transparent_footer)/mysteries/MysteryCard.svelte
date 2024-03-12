<script lang="ts">
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { convertToSnakeCaseEnhanced } from '$lib/generic-helpers';
	import { Card } from 'flowbite-svelte';
	import { LockSolid } from 'flowbite-svelte-icons';

	export let mystery: unknown;
	export let rating: number;
	export let unlocked: boolean;
	let bucketPath: string = PUBLIC_SUPABASE_URL + '/storage/v1/object/public/user_mysteries/';

	function mysteryPath(mystery: unknown) {
		if (mystery.access_code != 'user') {
			return '/images/mysteries/' + mystery.name.replace(/ /g, '_').toLowerCase() + '.webp';
		}
		const path = bucketPath + mystery.slug + '/published/' + convertToSnakeCaseEnhanced(mystery.name);
		return path;
	}
</script>

<Card
	img={mysteryPath(mystery)}
	class="rounded border-8 border-quaternary !bg-quaternary"
	padding="none"
	href={unlocked ? mystery.slug : undefined}
>
	<div class="m-4 flex justify-center">
		<div class="flex flex-col justify-between font-primary text-2xl text-tertiary-500">
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
