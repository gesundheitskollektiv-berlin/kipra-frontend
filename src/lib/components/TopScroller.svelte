<script>
	import { browser } from '$app/environment';

	let isVisible = $state(false);

	$effect(() => {
		if (!browser) return;

		const handleScroll = () => {
			isVisible = window.scrollY > 300;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

{#if isVisible}
	<button
		onclick={scrollToTop}
		class="top-scroller position-fixed bottom-0 end-0 m-3 m-md-4"
		aria-label="Scroll to top"
	>
		<i class="fas fa-arrow-up"></i>
	</button>
{/if}

<style>
	.top-scroller {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background-color: #2e2e2e;
		color: #fff;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
		z-index: 1020;
	}

	.top-scroller:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
	}
</style>
