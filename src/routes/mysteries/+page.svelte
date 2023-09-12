<script lang="ts">
	import { goto } from "$app/navigation";
	import { createNewChat } from "$misc/shared";
	import { chatStore } from "$misc/stores";
	import { template } from "@supabase/auth-ui-shared";
  import { Card, Button,  } from "flowbite-svelte";
	import { onMount } from "svelte";

  export let data;

  //onMount(() => {
  //  //$chatStore = {} 
  //});

  function createOrSetChat(name: string, prompt: string, answer: string) {
    console.log($chatStore[name]);
    if(!$chatStore[name] || $chatStore[name].messages.length <= 0) {
      createNewChat({title: name, prompt: prompt, answer: answer});
      console.log("creating new chat");
    } else {
      console.log("chat already exists");
      goto(name);
    }
  }


</script>


<h1>{data.amount}</h1>
<div class="p-4 w-full flex">
  {#each data.mysteries as mystery}
    <div class="p-4">
      <Card img="/images/police_captain.png">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{mystery.name}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {mystery.description}
        </p>
        {#if data.amount > 0}
          <Button color="dark" on:click={() => createOrSetChat(mystery.name.toLowerCase().replace(/\s+/g, '_'), mystery.prompt, mystery.answer)}>Play</Button>
        {:else}
        <form action="/api/create-checkout-session" method="POST">
          <Button color="dark" type="submit" id="checkout-button">Buy 3€</Button>
        </form>
        {/if}
      </Card>
    </div>
  {/each}

</div>