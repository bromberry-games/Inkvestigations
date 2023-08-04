<script lang="ts">
  import { Textarea, Button } from "flowbite-svelte";
  import { writable, } from 'svelte/store';
	import Message from "../lib/components/message.svelte";
	import type { MessageData } from "../data/message";

  let text = '';
  let answer_text = '';

  const messages = writable<MessageData[]>([]);

  async function handleSubmit() {
    const response = await fetch(`http://localhost:8000/generate?text=${text}`,
      {method: 'post'} 
    );
    if (!response.ok) {
      console.error('API request failed', response.status, await response.text());
      return;
    }

    messages.update(curr => curr.concat( 
      {
        role: 'user', 
        content: text
      }
    ));

    text = '';

    const data = await response.json();
    console.log(data);
    messages.update(
      curr => curr.concat(data.generated_text)
    );
  }
   
</script>

<form action="/create-checkout-session" method="POST">
  <button type="submit" id="checkout-button">Checkout</button>
</form>
<div class="flex justify-center p-4 h-full">
  <div class="w-1/2 text-center flex flex-col justify-items-end h-full ">
    <div class="max-h-[80vh] overflow-y-auto">
      {#each $messages as message}
        <Message {message} />
      {/each}
    </div>
    <div class="absolute bottom-0 left-0 w-full m-10">
      <div class="p-10">
        <Textarea bind:value={text} id="message" rows="5" class="mt-1 block w-full h-full rounded-md bg-gray-100 border-gray-300" placeholder="Enter some long multiline text..."></Textarea>
      </div>
      <Button on:click={handleSubmit} class="bg-blue-500 w-1/2">Submit</Button>
    </div>
  </div>
</div>