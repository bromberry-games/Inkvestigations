<script>
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink, FooterBrand, FooterIcon } from 'flowbite-svelte';
	import { FacebookSolid, GithubSolid, DiscordSolid, TwitterSolid } from 'flowbite-svelte-icons';
</script>

<Footer footerType="socialmedia" class="!bg-tertiary-500">
	<hr class="my-6 border-gray-700 dark:border-gray-700 sm:mx-auto lg:my-8" />
	<div class="md:flex md:justify-between">
		<div class="mb-6 md:mb-0">
			<!-- <FooterBrand href="https://flowbite.com" src="/images/flowbite-svelte-icon-logo.svg" alt="Flowbite Logo" name="Flowbite" /> -->
		</div>
		<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
			<!-- <div> -->
			<!-- <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Resources</h2> -->
			<!-- <FooterLinkGroup> -->
			<!-- <FooterLink liClass="mb-4" href="/">Flowbite</FooterLink> -->
			<!-- <FooterLink liClass="mb-4" href="/">Tailwind CSS</FooterLink> -->
			<!-- </FooterLinkGroup> -->
			<!-- </div> -->
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Follow us</h2>
				<FooterLinkGroup>
					<!-- <FooterLink liClass="mb-4" href="/">GitHub</FooterLink> -->
					<FooterLink liClass="mb-4" href="https://discord.gg/t3zTYNhNzp">Discord</FooterLink>
					<FooterLink liClass="mb-4" href="https://github.com/bromberry-games/Inkvestigations">Github</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-4" href="/legal/privacy-policy">Privacy Policy</FooterLink>
					<FooterLink liClass="mb-4" href="/legal/terms-and-conditions">Terms & Conditions</FooterLink>
					<FooterLink liClass="mb-4" href="/legal/dmca-policy">DMCA Policy</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Contact</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-4" href="mailto:bromberrygames@pm.me">bromberrygames@pm.me</FooterLink>
				</FooterLinkGroup>
			</div>
		</div>
	</div>
	<div class="sm:flex sm:items-center sm:justify-between">
		<FooterCopyright href="/" by="Bromberry games™" />
		<div class="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
			<!-- <FooterIcon href="/"> -->
			<!-- <FacebookSolid class="h-4 w-4 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" /> -->
			<!-- </FooterIcon> -->
			<FooterIcon href="https://discord.gg/t3zTYNhNzp">
				<DiscordSolid class="h-4 w-4 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" />
			</FooterIcon>
			<!-- <FooterIcon href="/"> -->
			<!-- <TwitterSolid class="h-4 w-4 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" /> -->
			<!-- </FooterIcon> -->
			<FooterIcon href="https://github.com/bromberry-games/Inkvestigations">
				<GithubSolid class="h-4 w-4 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" />
			</FooterIcon>
		</div>
	</div>
</Footer>
