<script>
	import MyLayout from '$lib/MyLayout.svelte';
	import Newsletter from '../lib/Newsletter.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="flex flex-1">
	<div class="bg-tertiary-400 flex-auto">
		<section class="relative justify-center bg-[url(/images/hero_page.webp)] bg-cover bg-bottom bg-no-repeat pb-80 md:h-screen">
			<div id="nav">
				<MyLayout {supabase} {session}></MyLayout>
			</div>
			<div class="flex justify-end lg:mr-44">
				<div class="container mt-44 px-4 text-center sm:px-6 lg:px-8 xl:mt-52 2xl:mt-24">
					<div class="font-secondary">
						<!-- Adjusting margin to push content to the left -->
						<h1 class="text-tertiary-400 mb-4 text-end text-7xl font-extrabold tracking-wide">INTERACTIVE MYSTERY GAMES</h1>
						<div class="flex justify-end">
							<h2 class="text-tertiary-400 mb-8 mt-4 max-w-sm text-end sm:text-xl md:max-w-2xl">
								A new type of game's afoot in these AI powered mystery murder stories. Inkvestigation combines authored mysteries with
								dynamic storytelling.
							</h2>
						</div>
						<div class="mt-16 flex justify-end">
							<Button class="bg-tertiary-400 w-1/2 rounded-none py-4 font-primary !text-4xl !text-quaternary lg:w-1/4" href="/try-for-free"
								>TRY FOR FREE</Button
							>
						</div>			
		</section>
		<div class="m-16 bg-tertiary-400 font-primary">
  			<h2 class="text-tertiary font-extrabold text-4xl">
    			Think Deductive, Be Detective
  			</h2>
  			<p class="mt-4 mr-8 font-secondary font-bold">
    			In Inkvestigations game you slip into the shoes of the greatest detective: Sherlock Holmes. 
    			A crime has occurred and police chief Wellington needs your help to solve it. By writing orders to the chief, he will perform those tasks to the best of his ability in order to give you more clues. When you have gathered enough clues, you will tell Wellington your solution. If you are right the criminal will be caught!
  			</p>
  			<h2 class="text-tertiary mt-8 font-extrabold text-4xl text-right">
    			Test your smarts
  			</h2>
  			<p class="mt-4 font-secondary font-bold text-right">
    			This is a game of wits. Facing off against the worst of criminals is no easy task. They make it harder by obscuring their deeds with many misleads, and sometimes Wellington is not a great help. In times like these, you will have to persevere even if the next step is not so clear. And who knows, sometimes you'll get lucky and a new event will reveal the missing piece.
  			</p>
  			<h2 class="text-tertiary font-extrabold mt-8 text-4xl">
    			Countless possibilities
  			</h2>
  			<p class="mt-4 font-secondary font-bold">
    			No more invisible walls. Thanks to the power of AI, you can pursue any lead that strikes you as important. But beware: not every lead ends with something useful. You must see through the noise and separate the important clues from unimportant information.
  			</p>
  			<h2 class="text-tertiary font-extrabold mt-8 text-4xl text-right">
    			Challenge your friends
  			</h2>
  			<p class="mt-4 font-secondary font-bold text-right">
    			You can create your own mysteries--fast! Want to challenge a friend to a battle of wits? Go to the mystery creator and set up your story. Easily write and publish your case and send a link to your friends.
  			</p>
		</div>
</div>

<style>
	#nav {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
		margin-bottom: 24px;
	}
</style>
