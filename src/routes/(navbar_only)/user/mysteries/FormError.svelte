<script lang="ts">
	export let error: string[] | undefined;
	export let classes: string = '';
</script>

{#if error}
	<p class={classes + ' text-red-500'}>{error}</p>
{/if}
