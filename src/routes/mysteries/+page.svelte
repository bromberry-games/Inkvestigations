<script>
  import { Card, Button,  } from "flowbite-svelte";
</script>
<div class="p-4 w-full flex">
<div class="p-4">
  <Card img="/public/police_captain.png">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">The deadly diner</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
    <form action="/create-checkout-session" method="POST">
      <Button color="dark" type="submit" id="checkout-button">Buy 3€</Button>
    </form>
  </Card>
</div>
<div class="p-4">
  <Card img="/public/police_captain.png">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
    <form action="/create-checkout-session" method="POST">
      <Button color="dark" type="submit" id="checkout-button">Buy 5€</Button>
    </form>
  </Card>
</div>

</div>