<script>
	import { slugify } from '$lib/helpers/landingBlocks';

	let { data = {}, meta = {}, locale = 'de' } = $props();

	const backgroundClass = $derived(
		data?.background_color ? `bg-kipra-${data.background_color}` : 'bg-kipra-green'
	);
	const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'footer');
	const baseUrl = $derived(`/${locale}`);
</script>

<footer id={sectionId} class={`${backgroundClass} py-5`}>
	<div class="container fs-5" id="footer">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-11 col-sm-11">
				<div class="row">
					<div class="col-12">
						<a href={baseUrl}>
							<figure class="mb-0 py-3 text-start">
								<img
									src="/images/Logo-Praxis-Footer.svg"
									alt="Logo"
									class="footer-logo"
								/>
							</figure>
						</a>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-md-4 contact-data">
						<h5 class="h5">Kontakt</h5>
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
								<span class="fa fa-envelope" aria-hidden="true"></span>
								&nbsp;<a href="mailto:{meta.email}" class="text-decoration-none">{meta.email}</a>
							</p>
						{/if}
					</div>

					<div class="col-md-4">
						<h5 class="h5">Impressum</h5>
						<p><em>Berufsausübungsgemeinschaft (BAG)</em></p>
						<p><strong>Stadtteil-Praxis Neukölln</strong></p>
						<p>
							<strong>Johanna Henatsch</strong><br />
							<em>Fachärztin für Innere Medizin</em>
						</p>
						<p>
							<strong>Kirsten Schubert</strong><br />
							<em>Fachärztin für Allgemeinmedizin</em><br />
							<em>Hausärztliche Versorgung</em>
						</p>
					</div>

					<div class="col-md-4">
						<h5 class="h5">Zuständige Aufsichtsbehörde</h5>
						<p>
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
							<a href="{baseUrl}/datenschutz" class="text-decoration-underline fw-lighter"
								>Datenschutz</a
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer-logo {
		height: 80px;
		width: auto;
		max-width: 100%;
	}

	@media (max-width: 575.98px) {
		.footer-logo {
			height: auto;
			width: 100%;
			max-width: 320px;
		}
	}

	footer :global(p),
	footer :global(h5),
	footer :global(a) {
		overflow-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}
</style>
