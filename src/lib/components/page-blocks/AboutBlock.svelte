<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';
	import { t } from '$lib/helpers/translation';
	import { slugify } from '$lib/helpers/landingBlocks';
	import PersonnelSection from './about/PersonnelSection.svelte';

	let { data = {}, locale = 'de', personnel = [], materials = [] } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about');

	const getDownloadUrl = (file) => {
		if (!file?.url) return '';
		if (file.url.startsWith('http')) return file.url;
		return `${getStrapiPublicUrl()}${file.url}`;
	};

	const stripExt = (name = '') => name.replace(/\.[^.]+$/, '');
	const fileExtLabel = (file) => (file?.ext || '').replace('.', '').toUpperCase();
	const fileSizeLabel = (file) => {
		const size = file?.size;
		if (typeof size !== 'number') return '';
		return `${Math.round(size)}kb`;
	};
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

	{#if materials.length > 0}
		<section class="bg-kipra-yellow py-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-lg-10 col-md-11 col-sm-11">
						<h2 class="mb-3 mb-lg-5">{t(locale).materialsHeading}</h2>

						{#each materials as material (material.id)}
							<div class="row align-items-start mt-5">
								<div class="col-12 col-md-9 col-lg-10 order-md-last">
									<h4 class="mb-3">{material.title}</h4>

									{#if material.description}
										<div class="rich-text">
											{@html resolveRichText(material.description)}
										</div>
									{/if}
								</div>

								{#if material.file}
									<div class="col-12 col-md-3 col-lg-2 order-md-first mt-3 mt-md-0">
										<!-- prettier-ignore -->
										<a
											class="material-download"
											href={getDownloadUrl(material.file)}
											download={material.file.name || ''}
											target="_blank"
											rel="noopener noreferrer"
										>
											<span class="fas fa-file-arrow-down material-download__icon" aria-hidden="true"></span>
											<span class="material-download__meta">
												<span class="material-download__title">{stripExt(material.file.name) || material.title}</span>
												<span class="material-download__info">
													{fileExtLabel(material.file)}{#if fileSizeLabel(material.file)} | {fileSizeLabel(material.file)}{/if}
												</span>
											</span>
										</a>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

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

	.material-download {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		line-height: 1.2;
	}

	.material-download:hover .material-download__title,
	.material-download:focus .material-download__title {
		text-decoration: underline;
	}

	.material-download__icon {
		font-size: 2rem;
	}

	.material-download__meta {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.material-download__title {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.material-download__info {
		text-decoration: underline;
		font-size: 0.95rem;
	}
</style>
