<div class="flex justify-center">
	<div class="w-3/4">
		<slot />
	</div>
</div>

<style>
	div :global(h1) {
		@apply text-4xl font-bold;
	}
	div :global(h2) {
		@apply text-3xl font-bold;
	}
	div :global(h3) {
		@apply text-2xl font-bold;
	}
	div :global(p) {
		@apply my-2;
	}
	div :global(a) {
		@apply text-blue-700;
	}
	div :global(ul) {
		@apply list-inside list-disc;
	}
</style>
