<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import DayRow from './DayRow.svelte';

	let { sprechstunde = {}, formatDoctors, locale = 'de' } = $props();

	const days = $derived(sprechstunde?.days ?? []);
</script>

<div class="sprechstunde-type mt-5">
	{#if sprechstunde.type}
		<h3>{sprechstunde.type}</h3>
	{/if}

	{#if sprechstunde.description}
		<div class="mt-2 sprechstunde-description">
			{@html resolveRichText(sprechstunde.description)}
		</div>
	{/if}

	{#if days.length > 0}
		<div class="mt-3">
			{#each days as tag, j (tag.id ?? j)}
				<DayRow {tag} {formatDoctors} {locale} />
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Italic in Strapi marks callout text; render as bold in the lilac notice (not italic) */
	.sprechstunde-description :global(i) {
		display: block;
		width: 100%;
		box-sizing: border-box;
		background-color: #c89edd;
		color: #fff;
		text-align: center;
		padding: 0.75rem 1.25rem;
		border-radius: 0.5rem;
		margin: 0.5rem 0;
		font-style: normal;
		font-weight: 700;
	}

	.sprechstunde-description :global(i a) {
		color: #fff;
		text-decoration: underline;
	}
</style>
