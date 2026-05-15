<script>
	import 'lazysizes';
	import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';

	let { src, asset, alt, style, class: classProps = '' } = $props();

	const getSrc = () => {
		const base = getStrapiPublicUrl();
		if (asset?.url) {
			const url = asset.url;
			if (url.startsWith('http')) return url;
			return `${base}${url}`;
		}
		if (src) {
			if (src.startsWith('http')) return src;
			return `${base}${src}`;
		}
		return '';
	};

	const resolvedSrc = $derived(getSrc());
	const resolvedAlt = $derived(alt || asset?.alternativeText || '');

	const buildSrcset = () => {
		if (!asset?.formats) return '';

		const formats = asset.formats;
		const baseUrl = getStrapiPublicUrl();
		const srcsetParts = [];

		if (formats.small?.url) {
			const url = formats.small.url.startsWith('http')
				? formats.small.url
				: `${baseUrl}${formats.small.url}`;
			srcsetParts.push(`${url} ${formats.small.width}w`);
		}
		if (formats.medium?.url) {
			const url = formats.medium.url.startsWith('http')
				? formats.medium.url
				: `${baseUrl}${formats.medium.url}`;
			srcsetParts.push(`${url} ${formats.medium.width}w`);
		}
		if (formats.large?.url) {
			const url = formats.large.url.startsWith('http')
				? formats.large.url
				: `${baseUrl}${formats.large.url}`;
			srcsetParts.push(`${url} ${formats.large.width}w`);
		}
		if (asset.url) {
			const url = asset.url.startsWith('http') ? asset.url : `${baseUrl}${asset.url}`;
			srcsetParts.push(`${url} ${asset.width || 1800}w`);
		}

		return srcsetParts.join(', ');
	};

	const srcset = $derived(buildSrcset());
	const defaultSrc = $derived(
		asset?.formats?.large?.url
			? asset.formats.large.url.startsWith('http')
				? asset.formats.large.url
				: `${getStrapiPublicUrl()}${asset.formats.large.url}`
			: resolvedSrc
	);
</script>

{#if resolvedSrc && !resolvedSrc.match(/\.(svg|webp)$/i)}
	{#if srcset}
		<img
			alt={resolvedAlt != null ? resolvedAlt : ' '}
			class={classProps + ' lazyload'}
			{style}
			data-src={defaultSrc}
			data-sizes="auto"
			data-srcset={srcset}
			src={defaultSrc}
		/>
	{:else}
		<img
			alt={resolvedAlt != null ? resolvedAlt : ' '}
			class={classProps + ' lazyload'}
			{style}
			data-src={resolvedSrc}
			data-sizes="auto"
			src={resolvedSrc}
		/>
	{/if}
{:else if resolvedSrc}
	<img src={resolvedSrc} alt={resolvedAlt != null ? resolvedAlt : ' '} class={classProps} {style} />
{/if}
