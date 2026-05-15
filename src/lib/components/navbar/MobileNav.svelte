<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { slugify } from '$lib/helpers/landingBlocks';
	import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

	const APPOINTMENT_URL =
		'https://webtermin.medatixx.de/#/8d8ca1e9-2ade-470a-86e7-ffd670b41b03';
	const GEKO_REFERENCE_URL = 'https://geko-berlin.de/';

	let { landingBlocks = [], locale = 'de' } = $props();
	let isOpen = $state(false);

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

	const close = () => (isOpen = false);

	const switchLocale = (l) => {
		const newPath = $page.url.pathname.replace(`/${locale}`, `/${l}`);
		isOpen = false;
		goto(newPath);
	};

	function handleNavClick(event) {
		const href = event.currentTarget.getAttribute('href');
		if (href && href.startsWith('#')) {
			event.preventDefault();
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);
			close();
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		} else {
			close();
		}
	}

	$effect(() => {
		if (!isOpen) return;
		const onKey = (e) => {
			if (e.key === 'Escape') close();
		};
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', onKey);
		};
	});

	$effect(() => {
		const mq = window.matchMedia('(min-width: 1200px)');
		const handler = (e) => {
			if (e.matches) isOpen = false;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});
</script>

<header class="mobile-bar bg-kipra-yellow d-xl-none">
	<a class="brand" href="/{locale}" aria-label="Stadtteilpraxis Startseite">
		<img src="/images/Logo-Praxis.svg" alt="Logo Stadtteilpraxis" class="brand-logo" />
	</a>
	<button
		type="button"
		class="burger"
		class:open={isOpen}
		aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
	>
		<span></span><span></span><span></span>
	</button>
</header>

{#if isOpen}
	<div
		class="mobile-overlay bg-kipra-yellow"
		role="dialog"
		aria-modal="true"
		aria-label="Hauptnavigation"
	>
		<header class="mobile-bar overlay-bar">
			<a
				class="brand"
				href="/{locale}"
				onclick={close}
				aria-label="Stadtteilpraxis Startseite"
			>
				<img src="/images/Logo-Praxis.svg" alt="Logo Stadtteilpraxis" class="brand-logo" />
			</a>
			<button
				class="burger open"
				type="button"
				onclick={close}
				aria-label="Menü schließen"
			>
				<span></span><span></span><span></span>
			</button>
		</header>

		<nav class="overlay-nav">
			<ul class="overlay-list">
				{#if isDetailPage}
					<li>
						<a
							href="/{locale}"
							onclick={close}
							class="btn-kipra bg-kipra-white text-black"
						>
							<i class="fas fa-arrow-left me-2"></i>
							{t(locale).back}
						</a>
					</li>
				{:else}
					{#each navItems as item}
						<li>
							<a
								href={item.href}
								onclick={handleNavClick}
								class="btn-kipra bg-kipra-white text-black"
							>
								{item.title}
							</a>
						</li>
					{/each}
				{/if}

				<li>
					<a
						href={APPOINTMENT_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-kipra btn-appointment"
						onclick={close}
					>
						{t(locale).bookAppointment}
					</a>
				</li>

				<li class="locale-group" aria-label={t(locale).languagesLabel}>
					<div class="locale-heading">{t(locale).languagesLabel}</div>
					<div class="locale-pills" role="group" aria-label={t(locale).languagesLabel}>
						{#each SUPPORTED_LOCALES as l}
							<button
								type="button"
								class="btn-kipra locale-pill"
								class:active={l === locale}
								aria-current={l === locale ? 'true' : undefined}
								onclick={() => switchLocale(l)}
							>
								{t(locale).languages[l]}
							</button>
						{/each}
					</div>
				</li>

				<li class="geko-reference-li">
					<a
						href={GEKO_REFERENCE_URL}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Geko Stadtteil-Gesundheits-Zentrum (externer Link)"
						onclick={close}
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
		</nav>
	</div>
{/if}

<style>
	.mobile-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.brand-logo {
		height: 44px;
		width: auto;
	}

	.burger {
		background: transparent;
		border: 0;
		width: 44px;
		height: 44px;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		padding: 0;
		cursor: pointer;
	}

	.burger span {
		display: block;
		width: 28px;
		height: 4px;
		border-radius: 2px;
		background: #000;
		transition: transform 250ms ease, opacity 200ms ease;
		transform-origin: center;
	}

	.burger.open span:nth-child(1) {
		transform: translateY(10px) rotate(45deg);
	}
	.burger.open span:nth-child(2) {
		opacity: 0;
	}
	.burger.open span:nth-child(3) {
		transform: translateY(-10px) rotate(-45deg);
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 1050;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.overlay-bar {
		box-shadow: none;
		position: static;
	}

	.overlay-nav {
		flex: 1;
		padding: 24px 24px 32px;
	}

	.overlay-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 14px;
	}

	.overlay-list :global(.btn-kipra) {
		font-size: 1.125rem;
		padding: 12px 22px;
		border-radius: 24px;
		font-family: 'CerebriSansPro', system-ui, sans-serif;
		font-weight: 700;
		text-decoration: none;
		display: inline-block;
	}

	.overlay-list :global(li > .btn-kipra:not(.btn-appointment):not(.locale-pill):hover) {
		background-color: var(--bs-kipra-yellow-light) !important;
	}

	.overlay-list :global(li > .btn-kipra.active),
	.overlay-list :global(li > .btn-kipra.active:hover) {
		background-color: var(--bs-kipra-yellow) !important;
	}

	.btn-appointment {
		background-color: var(--bs-kipra-purple);
		color: #000;
	}

	.btn-appointment:hover,
	.btn-appointment:focus {
		background-color: var(--bs-kipra-purple);
		color: #000;
		filter: brightness(0.95);
	}

	.locale-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12px;
		margin-top: 32px;
	}

	.locale-heading {
		font-weight: 800;
		font-size: 1.375rem;
	}

	.locale-pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
	}

	.locale-pill {
		background-color: var(--bs-kipra-yellow);
		color: #000;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.18);
	}

	.locale-pill:hover,
	.locale-pill:focus {
		background-color: var(--bs-kipra-yellow);
		color: #000;
	}

	.locale-pill.active,
	.locale-pill.active:hover,
	.locale-pill.active:focus {
		background-color: #000;
		color: var(--bs-kipra-yellow);
	}

	.geko-reference-li {
		margin-top: 32px;
	}

	.geko-reference {
		display: inline-flex;
		align-items: center;
	}

	.geko-reference-logo {
		height: 80px;
		width: auto;
		display: block;
	}
</style>
