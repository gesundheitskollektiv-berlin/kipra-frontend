<script>
	import { slugify } from '$lib/helpers/landingBlocks';
	import SprechstundeType from './sprechstunden/SprechstundeType.svelte';

	let { data = {}, locale = 'de' } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(
		data?.navbar_link_title ? slugify(data.navbar_link_title) : 'sprechstunden'
	);
	const sprechstunden = $derived(data?.sprechstunden ?? []);

	function formatDoctors(doctors) {
		if (!doctors?.length) return '';
		return doctors
			.map((d) => {
				const name = `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim();
				return `<a href="#mitarbeiterinnen">${name}</a>`;
			})
			.join(', ');
	}
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				<h2>{data.title}</h2>

				{#each sprechstunden as sprechstunde, i (sprechstunde.id ?? i)}
					<SprechstundeType {sprechstunde} {formatDoctors} {locale} />
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		line-height: 2;
	}
</style>
