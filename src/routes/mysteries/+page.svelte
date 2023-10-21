<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';

	export let data;
</script>

<div class="mb-56 flex w-full flex-wrap justify-center p-4">
	{#each data.mysteries as mystery, i}
		<div class="p-4">
			<Card img={mystery.filepath} class="rounded border-8 border-quaternary !bg-quaternary">
				<div class="mb-2 flex justify-between font-primary text-2xl text-tertiary">
					<h5>{mystery.name}</h5>
					<div>
						{#each Array(3) as _, index}
							{#if data.session && data.mysteries[i].solved.length > 0 && index < data.mysteries[i].solved[0].rating}
								★
							{:else}
								☆
							{/if}
						{/each}
					</div>
				</div>
				<p class="mb-3 text-left font-secondary font-normal leading-tight text-tertiary">
					{mystery.description}
				</p>
				{#if data.session}
					<div class="mt-4 flex justify-between font-primary text-xl">
						<Button class="!rounded-2xl bg-tertiary !px-8 text-xl !text-quaternary" href={mystery.name.replace(/\s+/g, '_')}>PLAY</Button>
						<form action="?/deleteChat" method="post">
							<input type="hidden" name="slug" value={mystery.name} />
							<Button class="h-full !rounded-2xl border-4 border-tertiary bg-quaternary !py-0 text-xl !text-tertiary" type="submit">
								RESTART
							</Button>
						</form>
					</div>
				{:else}
					<Button color="dark" href="/login">Login</Button>
				{/if}
			</Card>
		</div>
	{/each}
</div>
