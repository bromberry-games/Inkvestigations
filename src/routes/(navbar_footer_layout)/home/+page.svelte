<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import snarkdown from 'snarkdown';

	export let data;
	// $: slug = data.lastPlayed != undefined ? data.lastPlayed.user_mystery_conversations?.mystery_name.replace(/ /, '_') : undefined;
	$: mysterData =
		data.lastPlayed != undefined
			? {
					slug: data.lastPlayed.user_mystery_conversations?.mystery_slug,
					image: data.lastPlayed.user_mystery_conversations?.mysteries?.name.replace(/ /g, '_').toLowerCase(),
					message: data.lastPlayed.content,
					name: data.lastPlayed.user_mystery_conversations?.mysteries?.name
				}
			: {
					slug: data.first.slug,
					image: data.first.name.replace(/ /g, '_').toLowerCase(),
					message: data.first.description,
					name: data.first.name
				};
</script>

<div class="lg:h-screen">
	<div class="mt-4 flex justify-center font-secondary">
		<div class="flex w-full flex-wrap justify-center gap-4 md:w-3/4">
			<Card
				class="mx-2 grid w-full grid-cols-1 gap-x-4 bg-quaternary hover:bg-quaternary md:w-1/2 md:grid-cols-[4fr_5fr]"
				size="lg"
				href={mysterData.slug}
			>
				<div class="">
					<h1 class="text-tertiary-400 text-2xl">{data.lastPlayed != undefined ? 'Continue playing' : 'Start playing'}</h1>
					<p>{mysterData.name}</p>
				</div>
				<div class="">
					<p class="mt-8">{data.lastPlayed != undefined ? 'Police chief' : 'Description:'}</p>
				</div>

				<img src="/images/mysteries/{mysterData.image}.webp" alt="Continue playing" class="w-full rounded" />
				<div class="text-gray-200">
					<p>
						{@html snarkdown(mysterData.message)}
					</p>
				</div>
				<!-- <Button -->
				<!-- href={data.lastPlayed.user_mystery_conversations?.mystery_name.replace(/ /, '_')} -->
				<!-- class="mt-4 w-full rounded bg-tertiary-400 font-primary text-2xl text-quaternary">CONTINUE</Button -->
				<!-- > -->
			</Card>
			<iframe
				class="mx-2 h-96 w-full md:h-full md:w-1/3"
				title="Discord"
				src="https://discord.com/widget?id=1176909898651549756&theme=dark"
				width="350"
				ht="500"
				allowtransparency="true"
				frameborder="0"
				sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin
			allow-scripts"
			></iframe>
		</div>
	</div>
</div>
