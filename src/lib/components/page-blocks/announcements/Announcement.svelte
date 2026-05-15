<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	let { announcement = {}, locale = 'de', separator = false } = $props();

	function formatDate(iso) {
		if (!iso) return '';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '';
		return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(d);
	}

	const formattedDate = $derived(formatDate(announcement.publishedAt));
</script>

<article class="announcement mt-4" class:announcement-separated={separator}>
	{#if formattedDate}
		<time
			class="d-block text-start fst-italic small text-muted mb-1"
			datetime={announcement.publishedAt}
		>
			{formattedDate}
		</time>
	{/if}
	{#if announcement.title}
		<h3>{announcement.title}</h3>
	{/if}
	{#if announcement.content}
		<div class="announcement-body mt-2">
			{@html resolveRichText(announcement.content)}
		</div>
	{/if}
</article>

<style>
	.announcement-separated {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		padding-top: 1rem;
	}
</style>
