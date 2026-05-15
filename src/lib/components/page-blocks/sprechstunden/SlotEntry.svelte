<script>
	let { slot = {}, formatDoctors } = $props();
</script>

<div class="slot-entry">
	<div>
		{#if slot.description}
			<span class="fw-semibold">{slot.description}:</span>
		{/if}
		{#if slot.start && slot.end}
			<span>&nbsp;{slot.start}-{slot.end}</span>
		{:else if slot.start}
			<span>&nbsp;{slot.start}</span>
		{:else}
			<span>-</span>
		{/if}
	</div>

	{#if formatDoctors(slot.doctors)}
		<div class="doctor-links small">
			{@html formatDoctors(slot.doctors)}
		</div>
	{/if}

	{#if slot.annotation}
		<div class="fst-italic small text-muted">
			{slot.annotation}
		</div>
	{/if}
</div>

<style>
	.doctor-links :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.doctor-links :global(a:hover) {
		text-decoration: underline;
	}
</style>
