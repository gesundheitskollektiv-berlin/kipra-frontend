<script>
	import PersonCard from './PersonCard.svelte';

	let { personnel = [] } = $props();
</script>

{#if personnel.length > 0}
	<div id="mitarbeiterinnen" class="mt-5 personnel-section">
		<h3>Mitarbeiter*innen</h3>
		<div class="row mt-4">
			{#each personnel as person (person.id)}
				<PersonCard {person} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.personnel-section {
		scroll-margin-top: 100px;
	}
</style>
