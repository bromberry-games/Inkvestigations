<script>
    let subscribed = false;
    let error = '';
    let message = '';
  </script>
  

<div>  
  <form method="post">
    <label for="email">
      Email
      <input type="email" name="email" id="email" required>
    </label>
    <button type="submit">
      Submit
    </button>
    {#if subscribed}
      <p>Elementary!</p>
    {/if}
    {#if message}
      <p>Whoops ! {message}</p>
    {/if}
  </form>
</div>
