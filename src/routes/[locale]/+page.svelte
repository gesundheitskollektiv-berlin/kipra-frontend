<script>
	import WelcomeBlock from '$lib/components/page-blocks/WelcomeBlock.svelte';
	import AboutBlock from '$lib/components/page-blocks/AboutBlock.svelte';
	import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
	import SprechstundenBlock from '$lib/components/page-blocks/SprechstundenBlock.svelte';
	import ContactBlock from '$lib/components/page-blocks/ContactBlock.svelte';
	import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
	import AnnouncementsBlock from '$lib/components/page-blocks/AnnouncementsBlock.svelte';
	import TermineBlock from '$lib/components/page-blocks/TermineBlock.svelte';
	import UrgentAlerts from '$lib/components/UrgentAlerts.svelte';
	import StrapiImage from '$lib/components/StrapiImage.svelte';

	let { data } = $props();

	const landingPage = $derived(data['kipra-page-landing']?.data ?? {});
	const landingBlocks = $derived(landingPage?.content ?? []);
	const meta = $derived(data['kipra-meta']?.data ?? {});
	const locale = $derived(data.locale);

	const announcements = $derived(data['kipra-announcements']?.data ?? []);
	const urgentAnnouncements = $derived(announcements.filter((a) => a.is_urgent === true));
	const regularAnnouncements = $derived(announcements.filter((a) => a.is_urgent !== true));

	const personnel = $derived(data['kipra-personnels']?.data ?? []);
	const materials = $derived(data['kipra-materials']?.data ?? []);
</script>

{#if meta?.page_banner}
	<div class="w-100">
		<StrapiImage asset={meta.page_banner} alt="Banner" class="img-fluid w-100" />
	</div>
{/if}

{#if urgentAnnouncements.length > 0}
	<UrgentAlerts announcements={urgentAnnouncements} />
{/if}

{#each landingBlocks as block, idx (`${block?.__component ?? 'unknown'}-${block?.id ?? idx}`)}
	{#if block?.__component === 'kipra-page-blocks.welcome'}
		<WelcomeBlock data={block} />
	{:else if block?.__component === 'kipra-page-blocks.about'}
		<AboutBlock data={block} {locale} {personnel} {materials} />
	{:else if block?.__component === 'kipra-page-blocks.services'}
		<ServicesBlock data={block} />
	{:else if block?.__component === 'kipra-page-blocks.sprechstunden'}
		<SprechstundenBlock data={block} {locale} />
	{:else if block?.__component === 'kipra-page-blocks.contact'}
		<ContactBlock data={block} {meta} />
	{:else if block?.__component === 'kipra-page-blocks.footer'}
		<FooterBlock data={block} {meta} {locale} />
	{:else if block?.__component === 'kipra-page-blocks.termine'}
		<TermineBlock data={block} />
	{/if}
{/each}
