<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { slugify } from '$lib/helpers/landingBlocks';
	import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

	const GEKO_REFERENCE_URL = 'https://geko-berlin.de/';

	let { landingBlocks = [], locale = 'de' } = $props();

	let isScrolled = $state(false);

	$effect(() => {
		if (!browser) return;
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const isDetailPage = $derived(
		!!$page.url.pathname.match(/^\/[^/]+\/(datenschutz|impressum)$/)
	);

	const navItems = $derived(
		(landingBlocks || [])
			.filter((block) => block?.navbar_link === true)
			.map((block) => ({
				title: block?.navbar_link_title || '',
				href: `#${slugify(block?.navbar_link_title || '')}`
			}))
	);

	function handleNavClick(event) {
		const href = event.currentTarget.getAttribute('href');
		if (href && href.startsWith('#')) {
			event.preventDefault();
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}
</script>

<nav
	class="navbar navbar-expand navbar-light bg-kipra-white sticky-top d-none d-xl-flex"
	class:py-3={!isScrolled}
	class:py-2={isScrolled}
	class:is-scrolled={isScrolled}
>
	<div class="container">
		<a class="navbar-brand d-flex align-items-center" href="/{locale}">
			<img
				src="/images/Logo_Praxis1.svg"
				alt="Berghafenpraxis"
				class="navbar-logo"
				class:navbar-logo-small={isScrolled}
			/>
		</a>

		<div class="navbar-collapse">
			<ul class="navbar-nav ms-auto align-items-center nav-cluster">
				{#if isDetailPage}
					<li class="nav-item">
						<a class="btn-kipra bg-kipra-white text-black" href="/{locale}">
							<i class="fas fa-arrow-left me-2"></i>
							{t(locale).back}
						</a>
					</li>
				{:else}
					{#each navItems as item}
						<li class="nav-item">
							<a
								class="btn-kipra bg-kipra-yellow text-black"
								href={item.href}
								onclick={handleNavClick}
							>
								{item.title}
							</a>
						</li>
					{/each}
				{/if}

				<li class="nav-item dropdown locale-nav-slot">
					<button
						class="btn-kipra btn-locale dropdown-toggle"
						type="button"
						id="localeDropdownDesktop"
						data-bs-toggle="dropdown"
						data-bs-offset="0,16"
						aria-expanded="false"
					>
						{locale.toUpperCase()}
					</button>
					<ul
						class="dropdown-menu dropdown-menu-end locale-menu"
						aria-labelledby="localeDropdownDesktop"
					>
						{#each SUPPORTED_LOCALES as localeOption}
							{@const newPath = $page.url.pathname.replace(`/${locale}`, `/${localeOption}`)}
							<li>
								<a
									class="locale-item"
									class:active={localeOption === locale}
									aria-current={localeOption === locale ? 'true' : undefined}
									href={newPath}
								>
									{t(locale).languages[localeOption]}
								</a>
							</li>
						{/each}
					</ul>
				</li>

				<li class="nav-item d-flex align-items-center">
					<a
						href={GEKO_REFERENCE_URL}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Geko Stadtteil-Gesundheits-Zentrum (externer Link)"
						class="geko-reference"
					>
						<img
							src="/images/Logo_Geko_weiss_cropped.svg"
							alt="Geko"
							class="geko-reference-logo"
						/>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
	.navbar {
		z-index: 1030;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
		transition:
			padding 0.3s ease,
			box-shadow 0.3s ease;
	}

	.navbar.is-scrolled {
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
	}

	.navbar-logo {
		height: 55px;
		width: auto;
		transition: height 0.3s ease;
	}

	.navbar-logo-small {
		height: 45px;
	}

	.nav-cluster {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		column-gap: clamp(0.75rem, 1.4vw, 1.5rem);
		row-gap: 0.5rem;
	}

	.locale-nav-slot {
		margin-inline-start: clamp(2rem, 5vw, 4.5rem);
	}

	.navbar :global(.btn-kipra) {
		padding: 4px 12px;
		gap: 10px;
		border-radius: 24px;
		font-size: 1rem;
		line-height: 1.4;
		white-space: nowrap;
	}

	.navbar :global(.navbar-nav a.btn-kipra:not(.btn-locale):hover) {
		background-color: var(--bs-kipra-yellow-light) !important;
	}

	.navbar :global(.navbar-nav a.btn-kipra.active),
	.navbar :global(.navbar-nav a.btn-kipra.active:hover) {
		background-color: var(--bs-kipra-yellow) !important;
	}

	.btn-locale {
		background-color: #000;
		color: var(--bs-kipra-yellow);
	}

	.btn-locale:hover,
	.btn-locale:focus {
		background-color: #000;
		color: var(--bs-kipra-yellow);
	}

	.locale-menu {
		padding: 8px 0;
		border-radius: 20px;
		border: 2px solid #000;
		background: var(--bs-kipra-yellow);
		box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.1);
		min-width: 0;
		width: max-content;
		overflow: hidden;
	}

	.locale-item {
		display: block;
		padding: 10px 20px;
		color: #000;
		background: transparent;
		text-decoration: none;
		white-space: nowrap;
	}

	.locale-item:hover,
	.locale-item:focus {
		text-decoration: underline;
		color: #000;
		background: transparent;
	}

	.locale-item.active {
		text-decoration: underline;
	}

	.geko-reference {
		display: inline-flex;
		align-items: center;
	}

	.geko-reference-logo {
		height: 40px;
		width: auto;
		display: block;
	}
</style>
