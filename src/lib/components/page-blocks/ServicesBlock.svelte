<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import { slugify } from '$lib/helpers/landingBlocks';

	let { data = {} } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(
		data?.navbar_link_title ? slugify(data.navbar_link_title) : 'services'
	);
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				<h2>{data.title}</h2>

				{#if data?.content}
					<div class="mt-4 services-content">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		line-height: 2;
	}

	.services-content {
		--arrow-indent: calc(0.625rem + 0.6rem);
	}

	.services-content :global(> *:not(h4)) {
		padding-left: var(--arrow-indent);
	}

	section :global(h4) {
		margin-top: 2rem;
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
	}

	section :global(h4)::before {
		content: '';
		flex: 0 0 auto;
		display: inline-block;
		width: 0.625rem;
		height: 0.875rem;
		background-image: url('/images/Pfeil-Liste.svg');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		transform: translateY(0.05em);
	}

	section :global(ul) {
		list-style: none;
		list-style-image: none;
		margin-left: 0;
		padding-left: 0;
	}

	section :global(li) {
		margin-top: 0.15rem;
	}
</style>
