<script lang="ts">
import  Register  from '$lib/flowbite-blocks/Register.svelte';
import Section from '$lib/flowbite-blocks/Section.svelte';
import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
</script>

<Section name="register">
  <Register href="/">
    <svelte:fragment slot="top">
      <img class="w-8 h-8 mr-2" src="/images/logo.svg" alt="logo" />
      Flowbite
    </svelte:fragment>
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <form class="flex flex-col space-y-6" action="/">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create and account</h3>
        <Label class="space-y-2">
          <span>Your email</span>
          <Input type="email" name="email" placeholder="name@company.com" required />
        </Label>
        <Label class="space-y-2">
          <span>Your password</span>
          <Input type="password" name="password" placeholder="•••••" required />
        </Label>
        <Label class="space-y-2">
          <span>Confirm password</span>
          <Input type="password" name="confirm-password" placeholder="•••••" required />
        </Label>
        <div class="flex items-start">
          <Checkbox
            >I accept the <a
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              href="/"
            >
              Terms and Conditions</a
            ></Checkbox
          >
        </div>
        <Button type="submit" class="w-full1" color="red">Create an account</Button>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          Already have an account? <a
            href="/login"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Login here</a
          >
        </div>
      </form>
    </div>
  </Register>
</Section>