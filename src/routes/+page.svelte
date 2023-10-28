<script>
	import MyLayout from '$lib/MyLayout.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<!-- <section class="relative bg-[url(/images/hero_page.webp)] bg-cover bg-center bg-no-repeat">
	<div class="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
		<div class="max-w-xl">
			<h1 class="text-3xl font-extrabold sm:text-5xl">INTERACTIVE MYSTERY GAMES</h1>
			<p class="mt-4 max-w-lg sm:text-xl">
				A new type of game's afoot in these AI powered mystery murder stories. Inkvestigation combines authored mysteries with dynamic
				storytelling.
			</p>
			<button class="mt-8 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">TRY FOR FREE</button>
		</div>

		<!-- <div class="max-w-xl text-center sm:text-left">
			<h1 class="text-3xl font-extrabold sm:text-5xl">INTERACTIVE MYSTERY GAMES</h1>

			<p class="mt-4 max-w-lg sm:text-xl/relaxed">
				A new type of game's afoot in these AI powered mystery murder stories. Inkvestigation combines authored mysteries with dynamic
				storytelling.
			</p>
		</div>
	</div>
</section>
-->

<section class="relative h-screen justify-center bg-[url(/images/hero_page.webp)] bg-cover bg-top bg-no-repeat">
	<MyLayout {supabase} {session}></MyLayout>
	<div class="flex">
		<div class="container ml-52 mr-auto mt-52 px-4 text-center sm:px-6 lg:px-8">
			<div class=" font-secondary">
				<!-- Adjusting margin to push content to the left -->
				<h1 class="mb-4 text-end text-7xl font-extrabold tracking-wide text-tertiary">INTERACTIVE MYSTERY GAMES</h1>
				<div class="flex justify-end">
					<p class="mb-8 mt-4 max-w-2xl text-tertiary sm:text-xl">
						A new type of game's afoot in these AI powered mystery murder stories. Inkvestigation combines authored mysteries with dynamic
						storytelling.
					</p>
				</div>
				<div class="mt-16 flex justify-end">
					<Button class="w-1/4 rounded-none bg-tertiary py-4 font-primary !text-4xl !text-quaternary" href="/login">TRY FOR FREE</Button>
				</div>
			</div>
		</div>
	</div>
</section>
