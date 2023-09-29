<script lang="ts">
	import { goto } from "$app/navigation";
	import { createNewChat } from "$misc/shared";
	import { chatStore } from "$misc/stores";
  import { Card, Button,  } from "flowbite-svelte";

  export let data;

  function createOrSetChat(slug: string, prompt: string, answer: string, name: string) {
    console.log($chatStore[slug]);
    if(!$chatStore[slug] || $chatStore[slug].messages.length <= 0) {
      createNewChat({title: slug, prompt: prompt, answer: answer});
			fetch('/api/add-conversation', {
				method: 'POST',
				body: JSON.stringify({ mystery: name}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
    } else {
      goto(slug);
    }
  }

</script>


<h1>{data.amount}</h1>
<div class="p-4 w-full flex">
  {#each data.mysteries as mystery}
    <div class="p-4">
      <Card img="/images/deadly_diner.webp">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{mystery.name}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {mystery.description}
        </p>
        {#if data.amount > 0}
          <Button color="dark" on:click={() => createOrSetChat(mystery.name.replace(/\s+/g, '_'), mystery.prompt, mystery.answer, mystery.name)}>Play</Button>
        {:else}
        <form action="/api/create-checkout-session" method="POST">
          <Button color="dark" type="submit" id="checkout-button">Buy 3€</Button>
        </form>
        {/if}
      </Card>
    </div>
  {/each}

</div>