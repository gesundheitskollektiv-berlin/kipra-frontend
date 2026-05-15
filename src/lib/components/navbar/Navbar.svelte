<script>
	import DesktopNav from './DesktopNav.svelte';
	import MobileNav from './MobileNav.svelte';

	let { landingBlocks = [], locale = 'de' } = $props();
</script>

<DesktopNav {landingBlocks} {locale} />
<MobileNav {landingBlocks} {locale} />
