<script lang="ts">
    import {Modal, Radio, Button} from 'flowbite-svelte'

	export let clickOutsideModal = false;
    export let suspects;
    export let suspectToAccuse = '';
    $: if(suspectToAccuse != '') {
        clickOutsideModal = false;
    }
</script>


<Modal title="Pick a suspect to accuse" bind:open={clickOutsideModal} size="md" outsideclose>
	<div class="grid gap-6 w-full grid-cols-2 md:grid-cols-3">
		{#each suspects as suspect}
  		<Radio name="suspects" value={suspect} custom bind:group={suspectToAccuse}>
  		  <div class="flex justify-between flex-col items-center p-5 w-full cursor-pointer peer-checked:border-solid peer-checked:border-2 peer-checked:border-slate-500" >
				<img src="/images/police_captain.png">
				<p>{suspect}</p>
  		  </div>
  		</Radio>
		{/each}
	</div>
</Modal>