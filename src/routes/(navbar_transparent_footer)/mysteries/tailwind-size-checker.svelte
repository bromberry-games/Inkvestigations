<script lang="ts">
	import { onMount } from 'svelte';

	export let screenSize: string;

	function getCurrentScreenSize() {
		const sizes = ['sm', 'md', 'lg', 'xl', '2xl'];
		for (let size of sizes) {
			let elem = document.querySelector(`.breakpoint-checker [data-size="${size}"]`);
			if (window.getComputedStyle(elem).display !== 'none') {
				return size;
			}
		}
		return 'default'; // Fallback in case none is found
	}

	onMount(() => {
		screenSize = getCurrentScreenSize();
		window.addEventListener('resize', () => {
			screenSize = getCurrentScreenSize();
		});
	});
</script>

<div class="breakpoint-checker">
	<div class="sm:hidden" data-size="sm"></div>
	<div class="md:hidden" data-size="md"></div>
	<div class="lg:hidden" data-size="lg"></div>
	<div class="xl:hidden" data-size="xl"></div>
	<div class="2xl:hidden" data-size="2xl"></div>
</div>
