<script lang="ts">
	import { chatStore } from "$misc/stores.js";
  import { Card, Button,  } from "flowbite-svelte";

  export let data;
  $: {
    console.log(data)
  }
  function deleteChat(event: Event, mysterName: string) {
    event.preventDefault();
    chatStore.deleteChat(mysterName); 
  }
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
          <form action="?/deleteChat" method="post">
            <input type="hidden" name="slug" value={mystery.name} />
            <Button class="h-full bg-quaternary text-xl !text-tertiary border-tertiary border-4 !rounded-2xl !py-0" 
                  type="submit"> RESTART </Button>
          </form>
        </div>
        {:else}
          <Button color="dark" href="/login">Login</Button>
        {/if}
      </Card>
    </div>
  {/each}
</div>