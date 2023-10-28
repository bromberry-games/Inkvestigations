<script>
	import MyLayout from '$lib/MyLayout.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="flex h-full flex-1">
	<div class="h-full flex-auto bg-tertiary md:w-11/12">
		<section class="relative h-screen justify-center bg-[url(/images/hero_page.webp)] bg-cover bg-bottom bg-no-repeat">
			<div id="nav">
				<MyLayout {supabase} {session}></MyLayout>
			</div>
			<div class="mr-44 flex justify-end">
				<div class="container px-4 text-center sm:px-6 lg:px-8 xl:mt-52 2xl:mt-24">
					<div class="font-secondary">
						<!-- Adjusting margin to push content to the left -->
						<h1 class="mb-4 text-end text-7xl font-extrabold tracking-wide text-tertiary">INTERACTIVE MYSTERY GAMES</h1>
						<div class="flex justify-end">
							<p class="mb-8 mt-4 max-w-2xl text-end text-tertiary sm:text-xl">
								A new type of game's afoot in these AI powered mystery murder stories. Inkvestigation combines authored mysteries with
								dynamic storytelling.
							</p>
						</div>
						<div class="mt-16 flex justify-end">
							<Button class="w-1/4 rounded-none bg-tertiary py-4 font-primary !text-4xl !text-quaternary" href="/login">TRY FOR FREE</Button
							>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	#nav {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
		margin-bottom: 24px;
	}
</style>
