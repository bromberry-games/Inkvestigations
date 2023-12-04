<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

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

<p class="text-center font-primary text-xl font-medium">
	No more messages left
	<br />
	New messages in: {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {Math.floor(timeLeft % 60)}s
</p>
