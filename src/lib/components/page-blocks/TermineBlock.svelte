<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	let { data = {} } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
</script>

<section id="termine" class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				{#if data?.title}
					<h1>{data.title}</h1>
				{/if}

				{#if data?.content}
					<div class="mt-4">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
