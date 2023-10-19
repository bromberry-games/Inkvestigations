<script lang="ts">
  import { Card, Button,  } from "flowbite-svelte";

  export let data;
  $: {
    console.log(data)
  }
  $: rating = data.mysteries[0].rating
</script>


<div class="p-4 w-full flex flex-wrap justify-center">
  {#each data.mysteries as mystery, i}
    <div class="p-4">
      <Card img={mystery.filepath} class="!bg-quaternary border-8 border-quaternary rounded">
        <div class="flex mb-2 justify-between text-2xl text-tertiary font-primary">
          <h5 >{mystery.name}</h5>
          <div>
            {#each Array(3) as _, index}
              {#if data.mysteries[i].solved.length > 0 && index < data.mysteries[i].solved[0].rating}
                ★
              {:else}
                ☆
              {/if}
            {/each}
            </div>
        </div>
        <p class="mb-3 font-normal text-tertiary font-secondary leading-tight">
          {mystery.description}
        </p>
        {#if data.session}
        <div class="flex justify-between font-primary text-xl">
          <Button class="bg-tertiary text-xl !text-quaternary !rounded-2xl !px-8" href={mystery.name.replace(/\s+/g, '_')}> PLAY</Button>
          <Button class="bg-quaternary text-xl !text-tertiary border-tertiary border-4 !rounded-2xl !py-0" href={mystery.name.replace(/\s+/g, '_')}> RESTART </Button>
        </div>
        {:else}
          <Button color="dark" href="/login">Login</Button>
        {/if}
      </Card>
    </div>
  {/each}
</div>