<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { Button } from 'flowbite-svelte';

	let timeLeft = 0;

	const getSecondsTillMidnight = () => {
		const now = new Date();
		const midnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

		return Math.floor((midnightUTC.getTime() - now.getTime()) / 1000);
	};

	onMount(() => {
		timeLeft = getSecondsTillMidnight();

		const interval = setInterval(() => {
			timeLeft = getSecondsTillMidnight();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div>
	<p class="text-center font-primary text-xl font-medium">
		No more messages left
		<br />
		New messages in: {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {Math.floor(timeLeft % 60)}s
	</p>
	<div class="mt-2 text-center">
		<Button class="bg-quaternary !p-2 font-secondary text-xl text-tertiary" href="/pricing">BUY MORE</Button>
	</div>
</div>
