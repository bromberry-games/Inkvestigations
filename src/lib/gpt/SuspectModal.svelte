<script lang="ts">
	import { Modal, Radio, Button } from 'flowbite-svelte';

	export let clickOutsideModal = false;
	export let suspects;
	export let slug = '';
	export let suspectToAccuse = '';
	$: if (suspectToAccuse != '') {
		clickOutsideModal = false;
	}
</script>

<Modal
	title="Pick a suspect to accuse"
	bind:open={clickOutsideModal}
	size="md"
	outsideclose
	defaultClass="!bg-secondary overflow-y-auto"
	color="!bg-secondary"
>
	<div class="grid w-full grid-cols-2 gap-6 md:grid-cols-3">
		{#each suspects as suspect}
			<Radio name="suspects" value={suspect.name} custom bind:group={suspectToAccuse}>
				<div
					class="flex w-full cursor-pointer flex-col items-center justify-between p-5 peer-checked:border-2 peer-checked:border-solid peer-checked:border-slate-500"
				>
					<img src={'/images/mysteries/' + slug.toLowerCase() + '/suspects/' + suspect.imagepath} alt={suspect.name} />
					<p class="sm:text-lg md:text-xl">{suspect.name}</p>
				</div>
			</Radio>
		{/each}
	</div>
</Modal>
