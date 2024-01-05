<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';

	export let data;
</script>

<div class="absolute inset-0 -z-10 h-full w-full">
	<enhanced:img src="/static/images/mystery-page.webp" class="h-full w-full object-cover" sizes="min(1280px, 100vw)" alt="" />
	<div class="absolute inset-0 bg-[#404040] bg-opacity-80"></div>
</div>
<div
	class="h-dvh mx-8 mb-8 grid grid-cols-2 gap-x-8 gap-y-8 md:mx-16 md:gap-x-16 lg:grid-cols-3 lg:gap-x-36 xl:mx-40 xl:grid-cols-4 xl:gap-x-40"
>
	{#each data.mysteries as mystery, i}
		<Card
			img={mystery.filepath}
			class="rounded border-8 border-quaternary !bg-quaternary"
			padding="none"
			href={mystery.name.replace(/\s+/g, '_')}
		>
			<div class="m-4 flex justify-center">
				<div class="flex flex-col justify-between font-primary text-2xl text-tertiary">
					<h5 class="text-center text-xl md:text-2xl xl:text-4xl">{mystery.name}</h5>
					<div class="flex justify-center">
						{#each Array(3) as _, index}
							<p class="mx-2 inline text-4xl">
								{#if data.session && data.mysteries[i].solved.length > 0 && index < data.mysteries[i].solved[0].rating}
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
	{/each}
</div>
