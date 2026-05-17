<script>
	import { t } from '$lib/helpers/translation';
	import MaterialItem from './MaterialItem.svelte';

	let { materials = [], locale = 'de' } = $props();
</script>

{#if materials.length > 0}
	<section class="bg-kipra-yellow py-5">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-10 col-md-11 col-sm-11">
					<h2 class="mb-3 mb-lg-5">{t(locale).materialsHeading}</h2>

					{#each materials as material (material.id)}
						<MaterialItem {material} />
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
