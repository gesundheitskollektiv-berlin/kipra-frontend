<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';

	let { material = {} } = $props();

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

<article class="material-card mt-5">
	<h4 class="mb-3">{material.title}</h4>

	{#if material.description}
		<div class="rich-text material-card__description mb-3">
			{@html resolveRichText(material.description)}
		</div>
	{/if}

	{#if material.file}
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
	{/if}
</article>

<style>
	.material-card {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.material-download {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		line-height: 1.2;
		min-width: 0;
		max-width: 100%;
	}

	.material-download:hover .material-download__title,
	.material-download:focus .material-download__title {
		text-decoration: underline;
	}

	.material-download__icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.material-download__meta {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 0;
		flex: 1;
	}

	.material-download__title {
		font-size: 1.125rem;
		overflow-wrap: anywhere;
	}

	.material-download__info {
		text-decoration: underline;
		font-size: 0.95rem;
	}
</style>
