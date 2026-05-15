<script>
	import { t } from '$lib/helpers/translation';
	import SlotEntry from './SlotEntry.svelte';

	let { tag = {}, formatDoctors, locale = 'de' } = $props();

	const i18n = $derived(t(locale));
	const weekdayLocaleTag = $derived(locale === 'de' ? 'de-DE' : locale);

	let todayName = $state('');

	$effect(() => {
		const update = () => {
			todayName = new Intl.DateTimeFormat(weekdayLocaleTag, { weekday: 'long' }).format(
				new Date()
			);
		};
		update();
		const now = new Date();
		const msUntilMidnight =
			new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
		const timer = setTimeout(update, msUntilMidnight + 1000);
		return () => clearTimeout(timer);
	});

	const isToday = $derived(
		!!todayName &&
			(tag?.day || '').trim().toLowerCase() === todayName.trim().toLowerCase()
	);
</script>

<div class="day-row row py-3" class:is-today={isToday}>
	<div class="col-md-3 d-flex align-items-center gap-2 flex-wrap">
		<h4 class="fw-bold mb-0">{tag.day}</h4>
		{#if isToday}
			<span class="badge bg-kipra-yellow text-black">{i18n.today}</span>
		{/if}
	</div>
	{#if tag.sprechzeiten && tag.sprechzeiten.length > 0}
		{#each tag.sprechzeiten as slot, k (slot.id ?? k)}
			<div class="col">
				<SlotEntry {slot} {formatDoctors} />
			</div>
		{/each}
	{:else}
		<div class="col">
			<span>-</span>
		</div>
	{/if}
</div>

<style>
	.day-row {
		border-radius: 0.5rem;
		transition: background-color 0.15s ease;
	}

	.day-row:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.35);
	}

	.day-row.is-today {
		background-color: rgba(255, 255, 255, 0.7);
		border-left: 4px solid var(--bs-kipra-yellow, #fff15b);
		padding-left: 0.75rem;
	}
</style>
