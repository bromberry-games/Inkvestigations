<script>
	import MyLayout from '$lib/MyLayout.svelte';
	import MyFooter from '$lib/MyFooter.svelte';
	import HomepageParagraph from '$lib/HomepageParagraph.svelte';
	import { Button } from 'flowbite-svelte';
	import { FacebookSolid, GithubSolid, DiscordSolid, TwitterSolid } from 'flowbite-svelte-icons'
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="flex flex-1 ">
	<div class="flex-auto">
		<section class="relative justify-center bg-[url(/images/hero_page.webp)] bg-cover bg-bottom bg-no-repeat  md:h-screen mb-24">
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
						<div class="mt-16 flex justify-end ">
							<Button class="bg-tertiary-300 w-1/2 rounded py-4 font-primary !text-4xl !text-gray-900 lg:w-1/4" href="/try-for-free"
								>PLAY NOW</Button
							>
						</div>			
		</section>
		<div class=" inset-0 flex flex-col items-center justify-start gap-12 p-9 ">
				<HomepageParagraph header={`Think Deductive, Be Detective`} paragraph={`In Inkvestigations you slip into the shoes of the greatest detective: Sherlock Holmes.
				A crime has occurred and police chief Wellington needs your help to solve it. By writing orders to the chief, he will perform those tasks to the best of his ability in order to give you more clues. When you have gathered enough clues, you will tell Wellington your solution. If you are right the criminal will be caught!`}/>
				<HomepageParagraph header={`Test your smarts`} paragraph={`This is a game of wits. Facing off against the worst of criminals is no easy task. They make it harder by obscuring their deeds with many misleads, and sometimes Wellington is not a great help. In times like these, you will have to persevere even if the next step is not so clear and rely on your smarts to figure out how to proceed. And who knows, sometimes you'll get lucky and a new event will reveal the missing piece. `}/>
		
			  <div class="">
				<Button class="bg-gray-900 uppercase rounded py-4 font-primary !text-4xl !text-white" href="/try-for-free"
					>Click here to play</Button>
			</div>		
				<HomepageParagraph header={`Countless possibilities`} paragraph={`No more invisible walls. Thanks to the power of AI, you can pursue any lead that strikes you as important. But beware: not every lead ends with something useful. You must see through the noise and separate the important clues from unimportant information.`}/>  
				<HomepageParagraph header={`Challenge your friends`} paragraph={`You can create your own mysteries--fast! Want to challenge a friend to a battle of wits? Go to the mystery creator and set up your story. Easily write and publish your case and send a link to your friends.  `}/>
			  <div class="">
				<Button class="bg-gray-900 uppercase rounded py-4 font-primary !text-4xl !text-white" href="/user/mysteries/"
					>Click here to CREATE A MYSTERY</Button
				>
			</div>	
			<div>
			<HomepageParagraph header={`We're open source!`} paragraph={`Your opinion counts. Reach out to us on Discord and write us your thoughts. Or if you have suggestions what we could improve, you can open an issue on Github. We'd be thrilled to hear your ideas!`}/>
			<div class="w-full max-w-4xl p-16 bg-tertiary-400 font-primary rounded shadow-lg flex-col">
				<div class="-mt-20 text-center mt-8 flex-row ">
					<h3 class="font-primary text-4xl mb-12 text-gray-900">
						Check out the code and come say hi!
					</h3>
					<div class="flex justify-center">
					<a class="btn btn-sm ml-2 text-gray-900 " href="https://github.com/bromberry-games/Inkvestigations">
						<GithubSolid class="h-24 w-24 " />
					</a>
				
					<a class="btn btn-sm ml-2 text-gray-900" href="https://discord.gg/DhvuZDxrtz">
						<DiscordSolid class="h-24 w-24" />
					</a>
				</div>
				</div>
			</div>
			</div>
			
				
		  </div>
		  
	</div>
</div>
<div class="block w-full m-0 p-0 max-w-none">
<MyFooter ></MyFooter>
</div>
<style>
	#nav {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
		margin-bottom: 24px;
	}
</style>
