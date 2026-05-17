<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import { slugify } from '$lib/helpers/landingBlocks';
	import PersonnelSection from './about/PersonnelSection.svelte';
	import MaterialsSection from './about/MaterialsSection.svelte';

	let { data = {}, locale = 'de', personnel = [], materials = [] } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about');
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				<h2>{data.title}</h2>

				{#if data?.content}
					<div class="mt-4">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<MaterialsSection {materials} {locale} />

	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				<PersonnelSection {personnel} />
			</div>
		</div>
	</div>
</section>

<style>
	section {
		line-height: 2;
	}
</style>
