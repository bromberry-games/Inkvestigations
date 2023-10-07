<script lang="ts">
  import { Card, Button,  } from "flowbite-svelte";

  export let data;
</script>


<div class="p-4 w-full flex flex-wrap justify-center">
  {#each data.mysteries as mystery}
    <div class="p-4">
      <Card img={mystery.filepath}>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{mystery.name}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {mystery.description}
        </p>
        {#if data.session}
          <Button color="dark" href={mystery.name.replace(/\s+/g, '_')}> Play</Button>
        {:else}
          <Button color="dark" href="/login">Login</Button>
        {/if}
      </Card>
    </div>
  {/each}

</div>