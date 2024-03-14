<script lang="ts">
	import { Card, Button, Radio } from 'flowbite-svelte';
	import TailwindSizeChecker from './tailwind-size-checker.svelte';
	import MyPagination from './MyPagination.svelte';
	import MysteryCard from './MysteryCard.svelte';

	export let data;
	let screenSize: string;
	let subscription = 'free';
	let currentPage = 0;
	$: totalPages = Math.floor(currentMysteries.length / sizeToAmount[screenSize]);
	$: toDisplay = currentMysteries.slice(currentPage * sizeToAmount[screenSize], (currentPage + 1) * sizeToAmount[screenSize]);
	$: currentMysteries = getViewedMysteries(subscription);
	function getViewedMysteries(subsToShow: string) {
		currentPage = 0;
		return data.mysteries.filter((mystery) => mystery.access_code === subsToShow);
	}

	const sizeToAmount = {
		sm: 4,
		md: 4,
		lg: 4,
		xl: 6,
		'2xl': 8,
		default: 8
	};
</script>

<TailwindSizeChecker bind:screenSize />

<div class="absolute inset-0 -z-10 h-full w-full">
	<enhanced:img src="/static/images/mystery-page.webp" class="h-full w-full object-cover" sizes="min(1280px, 100vw)" alt="" />
	<div class="absolute inset-0 bg-[#404040] bg-opacity-80"></div>
</div>

<div class="mx-2 mb-2 flex justify-center">
	<div class="mx-1 grid w-full grid-cols-2 md:mx-4 md:gap-6 lg:w-1/2">
		<Radio name="custom" custom value="free" bind:group={subscription}>
			<div
				class="peer-checked:border-tertiary w-full cursor-pointer items-center justify-between rounded-lg border-4 border-quaternary bg-quaternary p-2 text-gray-500 hover:text-gray-600 peer-checked:text-gray-900"
			>
				<div class="text-md text-tertiary-400 w-full font-semibold md:text-lg">DEFAULT</div>
			</div>
		</Radio>
		<!-- <Radio name="custom" custom value="basic" bind:group={subscription}> -->
		<!-- <div -->
		<!-- class="w-full cursor-pointer items-center justify-between rounded-lg border-4 border-quaternary bg-quaternary p-2 text-gray-500 hover:text-gray-600 peer-checked:border-tertiary peer-checked:text-gray-900" -->
		<!-- > -->
		<!-- <div class="text-md w-full font-semibold text-tertiary-400 md:text-lg">SUBSCRIPTION</div> -->
		<!-- </div> -->
		<!-- </Radio> -->
		<Radio name="custom" custom value="user" bind:group={subscription}>
			<div
				class="peer-checked:border-tertiary w-full cursor-pointer items-center justify-between rounded-lg border-4 border-quaternary bg-quaternary p-2 text-gray-500 hover:text-gray-600 peer-checked:text-gray-900"
			>
				<div class="block">
					<div class="text-md text-tertiary-400 w-full font-semibold md:text-lg">USER</div>
				</div>
			</div>
		</Radio>
	</div>
	<MyPagination {totalPages} bind:currentPage></MyPagination>
</div>

<div class="mx-8 grid grid-cols-2 gap-x-8 gap-y-4 md:mx-16 md:gap-x-16 lg:grid-cols-3 lg:gap-x-36 xl:mx-40 xl:grid-cols-4 xl:gap-x-40">
	{#each toDisplay as mystery, i}
		<MysteryCard
			{mystery}
			rating={data.mysteries?.[i]?.solved?.length > 0 ? data.mysteries[i].solved[0].rating : 0}
			unlocked={data?.userAccessCodes?.includes(mystery.access_code) || mystery.access_code == 'free' || mystery.access_code == 'user'}
		/>
	{/each}
</div>
