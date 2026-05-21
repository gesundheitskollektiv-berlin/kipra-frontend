<script>
	import { onMount } from 'svelte';
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import { slugify } from '$lib/helpers/landingBlocks';
	import StrapiImage from '$lib/components/StrapiImage.svelte';
	import { t } from '$lib/helpers/translation';

	let { data = {}, meta = {}, locale = 'de' } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(
		data?.navbar_link_title ? slugify(data.navbar_link_title) : 'contact'
	);
	const mapQuery = $derived(
		encodeURIComponent(`${meta?.street ?? ''}, ${meta?.postal ?? ''} ${meta?.city ?? ''}`.trim())
	);

	/** @returns {unknown[]} */
	function normalizeMediaList(raw) {
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
		return [];
	}

	const slides = $derived.by(() => {
		const base = [
			{
				kind: 'iframe',
				src: `https://maps.google.com/maps?width=100%25&height=600&hl=${locale}&q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=B&output=embed`
			}
		];
		const imgs = normalizeMediaList(data?.images);
		for (const asset of imgs) {
			if (!asset) continue;
			base.push({
				kind: 'strapi',
				asset,
				alt: asset?.alternativeText || data?.title || ' '
			});
		}
		return base;
	});

	let activeSlide = $state(0);

	/** @type {ReturnType<typeof setInterval> | undefined} */
	let intervalId;

	function next() {
		const len = slides.length;
		if (len === 0) return;
		activeSlide = (activeSlide + 1) % len;
	}

	function prev() {
		const len = slides.length;
		if (len === 0) return;
		activeSlide = (activeSlide - 1 + len) % len;
	}

	function restart() {
		if (intervalId) clearInterval(intervalId);
		intervalId = setInterval(next, 5000);
	}

	function pause() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
	}

	/** @param {number} i */
	function go(i) {
		activeSlide = i;
		restart();
	}

	$effect(() => {
		const len = slides.length;
		if (len > 0 && activeSlide >= len) {
			activeSlide = len - 1;
		}
	});

	onMount(() => {
		restart();
		return () => pause();
	});
</script>

<section id={sectionId} class={`${backgroundClass} py-0`}>
	<div class="container" id="contact">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				<h2 class="mb-4">{data.title}</h2>

				<div class="row mb-5">
					<div class="col-md-6" id="contact-data">
						{#if meta?.street}
							<p>
								<span class="fa fa-home" aria-hidden="true"></span>
								&nbsp;
								{meta.street}, {meta.postal}
								{meta.city}
							</p>
						{/if}

						{#if meta?.phone}
							<p>
								<span class="fa fa-phone" aria-hidden="true"></span>
								&nbsp;
								<a href="tel:{meta.phone}">{meta.phone}</a>
							</p>
						{/if}

						{#if meta?.fax}
							<p>
								<span class="fa fa-fax" aria-hidden="true"></span>
								&nbsp;
								{meta.fax}
							</p>
						{/if}

						{#if meta?.email}
							<p>
								<span class="fa fa-envelope" aria-hidden="true"></span>
								&nbsp;
								<a href="mailto:{meta.email}">{meta.email}</a>
							</p>
						{/if}
					</div>
				</div>

				{#if slides.length > 0}
					<div
						class="contact-carousel carousel slide carousel-fade mb-4"
						onmouseenter={pause}
						onmouseleave={restart}
						onfocusin={pause}
						onfocusout={restart}
						role="region"
						aria-roledescription="carousel"
					>
						<div class="carousel-indicators">
							{#each slides as _, i}
								<button
									type="button"
									class:active={i === activeSlide}
									aria-current={i === activeSlide ? 'true' : undefined}
									aria-label={`${i + 1}`}
									onclick={() => go(i)}
								></button>
							{/each}
						</div>

						<div class="carousel-inner">
							{#each slides as slide, i}
								<div class="carousel-item" class:active={i === activeSlide}>
									{#if slide.kind === 'iframe'}
										<iframe
											src={slide.src}
											class="contact-carousel__media"
											title="Google Maps"
											allowfullscreen
											loading="lazy"
										></iframe>
									{:else if slide.kind === 'strapi'}
										<StrapiImage
											asset={slide.asset}
											alt={slide.alt}
											class="contact-carousel__media"
										/>
									{/if}
								</div>
							{/each}
						</div>

						<button
							class="carousel-control-prev"
							type="button"
							onclick={() => {
								prev();
								restart();
							}}
						>
							<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							<span class="visually-hidden">{t(locale).previous}</span>
						</button>
						<button
							class="carousel-control-next"
							type="button"
							onclick={() => {
								next();
								restart();
							}}
						>
							<span class="carousel-control-next-icon" aria-hidden="true"></span>
							<span class="visually-hidden">{t(locale).next}</span>
						</button>
					</div>
				{/if}

				{#if data?.content}
					<div class="content-container mb-4">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	#contact-data p {
		line-height: 2;
	}

	.content-container {
		overflow-wrap: break-word;
		word-wrap: break-word;
		max-width: 100%;
		overflow: hidden;
		line-height: 2;
	}

	.contact-carousel {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: 0.5rem;
		overflow: hidden;
		background: #000;
	}

	.contact-carousel .carousel-inner {
		height: 100%;
	}

	.contact-carousel .carousel-item {
		height: 100%;
	}

	.contact-carousel :global(.contact-carousel__media) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border: 0;
		display: block;
	}

	.contact-carousel .carousel-control-prev,
	.contact-carousel .carousel-control-next {
		width: auto;
		padding: 0 0.65rem;
		opacity: 1;
		filter: none;
		z-index: 4;
		background-image: none;
	}

	.contact-carousel .carousel-control-prev {
		left: 0.5rem;
	}

	.contact-carousel .carousel-control-next {
		right: 0.5rem;
	}

	.contact-carousel .carousel-control-prev:hover,
	.contact-carousel .carousel-control-next:hover,
	.contact-carousel .carousel-control-prev:focus,
	.contact-carousel .carousel-control-next:focus {
		opacity: 1;
	}

	.contact-carousel .carousel-control-prev-icon,
	.contact-carousel .carousel-control-next-icon {
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 50%;
		background-color: rgba(46, 46, 46, 0.88);
		background-size: 45% 45%;
		background-position: center;
		background-repeat: no-repeat;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
		transition: background-color 0.15s ease;
	}

	.contact-carousel .carousel-control-prev:hover .carousel-control-prev-icon,
	.contact-carousel .carousel-control-next:hover .carousel-control-next-icon,
	.contact-carousel .carousel-control-prev:focus .carousel-control-prev-icon,
	.contact-carousel .carousel-control-next:focus .carousel-control-next-icon {
		background-color: rgba(62, 62, 65, 0.95);
	}
</style>
