<script>
	import { slugify } from '$lib/helpers/landingBlocks';
	import { t } from '$lib/helpers/translation';
	import Announcement from './announcements/Announcement.svelte';

	let { data = {}, announcements = [], locale = 'de' } = $props();

	const latestAnnouncements = $derived(
		[...announcements]
			.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
			.slice(0, 3)
	);

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-white'
	);
	const sectionId = $derived(
		data?.navbar_link_title ? slugify(data.navbar_link_title) : 'announcements'
	);
	const i18n = $derived(t(locale));
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11 my-5">
				{#if data.title}
					<h2>{data.title}</h2>
				{/if}

				{#each latestAnnouncements as announcement, i (announcement.id)}
					<Announcement {announcement} {locale} separator={i > 0} />
				{/each}

				{#if latestAnnouncements.length === 0}
					<p class="text-muted mt-4">{i18n.noAnnouncements}</p>
				{/if}
			</div>
		</div>
	</div>
</section>
