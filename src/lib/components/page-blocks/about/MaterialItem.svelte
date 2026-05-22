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
	<div class="material-card__body">
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
					<!-- <span class="material-download__title">{stripExt(material.file.name) || material.title}</span> -->
					<span class="material-download__info">
						{fileExtLabel(material.file)}{#if fileSizeLabel(material.file)} | {fileSizeLabel(material.file)}{/if}
					</span>
				</span>
			</a>
		{/if}

		<div class="material-card__text">
			<h4 class="material-card__title">{material.title}</h4>
			{#if material.description}
				<div class="rich-text material-card__description">
					{@html resolveRichText(material.description)}
				</div>
			{/if}
		</div>
	</div>
</article>

<style>
	.material-card {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.material-card__body {
		display: flex;
		flex-direction: column-reverse;
		gap: 0.5rem;
	}

	.material-card__title {
		margin-bottom: 0.75rem;
	}

	.material-card__text {
		min-width: 0;
	}

	.material-card__body .material-download {
		margin-bottom: 1.5rem;
	}

	@media (min-width: 768px) {
		.material-card__body {
			flex-direction: row;
			align-items: center;
			gap: 1.5rem;
		}

		.material-card__body .material-download {
			flex-shrink: 0;
			margin-bottom: 0;
		}

		.material-card__body .material-card__text {
			flex: 1;
		}
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
		background-color: #fff;
		border-radius: 24px;
		padding: 0.75rem 1.25rem;
		transition: background-color 0.15s ease;
	}

	.material-download:hover,
	.material-download:focus {
		background-color: #dbd0ff;
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
