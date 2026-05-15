<script>
	import { slugify } from '$lib/helpers/landingBlocks';
	import { t } from '$lib/helpers/translation';

	let { data = {}, meta = {}, locale = 'de' } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-green'
	);
	const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'footer');
	const baseUrl = $derived(`/${locale}`);
	const i18n = $derived(t(locale));

	const partners = [
		{
			href: 'https://sea-watch.org/',
			img: '/images/sea-watch_logo.png',
			alt: 'Sea-Watch'
		},
		{
			href: 'https://www.bizim-kiez.de/',
			img: '/images/cropped-bizim-kiez-logo.png',
			alt: 'Bizim Kiez'
		},
		{
			href: 'https://partner.chiapas.eu',
			img: '/images/partner_suedmexikos.png',
			alt: 'Chiapas partner'
		}
	];
</script>

<!-- Mirrors geko-kinderpraxis _includes/footer.html -->
<footer id={sectionId} class={`${backgroundClass} py-5`}>
	<div class="container fs-5" id="footer">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11">
				<div class="row">
					<div class="col-12 text-md-start text-center">
						<a href={baseUrl}>
							<figure class="mb-0 py-3">
								<img
									src="/images/Logo_Praxis1_Footer.svg"
									alt="Logo"
									class="img-fluid"
								/>
							</figure>
						</a>
					</div>
				</div>

				<div class="row mt-4">
					<!-- Kontakt (wie contact.html + page_settings) -->
					<div class="col-md-6 text-md-start text-center mb-4 mb-md-0">
						<h4 class="h4">{i18n.contact}</h4>

						{#if meta?.street}
							<p>
								<span class="fa fa-home" aria-hidden="true"></span>
								&nbsp;{meta.street}, {meta.postal} {meta.city}
							</p>
						{/if}

						{#if meta?.phone}
							<p>
								<span class="fa fa-phone" aria-hidden="true"></span>
								&nbsp;<a href="tel:{meta.phone}" class="text-decoration-none">{meta.phone}</a>
							</p>
						{/if}

						{#if meta?.fax}
							<p>
								<span class="fa fa-fax" aria-hidden="true"></span>
								&nbsp;{meta.fax}
							</p>
						{/if}

						{#if meta?.email}
							<p>
								<span class="fa fa-at" aria-hidden="true"></span>
								&nbsp;<a href="mailto:{meta.email}" class="text-decoration-none">{meta.email}</a>
							</p>
						{/if}
					</div>

					<!-- Impressum (wie footer.html rechte Spalte) -->
					<div class="col-md-6 text-md-start text-center">
						<h4 class="h4">{i18n.imprint}</h4>
						<p>
							Dr. med. Lothar Müller<br />
							- Facharzt für Kinder- und Jugendmedizin<br />
							- Berufsbezeichnung erworben in Deutschland<br />
						</p>
						<p>
							Dr. med. Eva Feuerhahn (angestellte Fachärztin)<br />
							Dr. med. Laura Schlemmer (angestellte Fachärztin)<br />
							Dr. med. Lena Wirth (angestellte Fachärztin)<br />
							Dr. med. Jonathan Zepp (angestellter Facharzt)<br />
						</p>
						<p>
							<strong>Zuständige Aufsichtsbehörde</strong><br />
							Landesamt für Gesundheit und Soziales (LAGeSo)<br />
							Postanschrift: Postfach 31 09 29, 10639 Berlin<br />
							Telefon: (030) 90229-0
						</p>
						<p>
							<strong>Ärztekammer Berlin</strong><br />
							Friedrichstraße 16<br />
							10969 Berlin
						</p>
						<p>
							<a href="{baseUrl}/datenschutz" class="footer-link text-decoration-underline fw-lighter">
								{i18n.privacyPolicyShort}
							</a>
						</p>
					</div>
				</div>

				<div class="row mt-4 align-items-center">
					{#each partners as { href, img, alt } (href)}
						<div class="col-12 col-md-4 text-center py-2">
							<a {href} rel="noopener noreferrer" target="_blank">
								<img src={img} {alt} class="img-fluid" />
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	footer :global(p),
	footer :global(h4),
	footer :global(a) {
		overflow-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}
</style>
