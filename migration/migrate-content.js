/**
 * Jekyll (geko-kinderpraxis) snapshot → Strapi (`kipra-meta`, personnel, privacy,
 * announcements, landing dynamic zone). Idempotent upserts.
 *
 * Run specific steps only: `--only=personnel`, `--only news`, or comma lists.
 * See `migrate-content.js --help`.
 */

import {
	createStrapiClient,
	normalizeStrapiUrl,
	postCollection,
	putCollectionDocument,
	putSingleType,
	findCollectionFirst,
	logStrapiError,
} from './api.js';
import { loadMigrationEnv } from './loadEnv.js';
import { simpleMarkdownToBlocks } from './mdToBlocks.js';
import {
	META,
	PRIVACY_BODY_DE,
	PRIVACY_BODY_EN,
	PRIVACY_TITLE,
	ANNOUNCEMENT_TITLE,
	ANNOUNCEMENT_BODY_DE,
	ANNOUNCEMENT_BODY_EN,
	ANNOUNCEMENT_IS_URGENT,
	PERSONNEL,
} from './data/extracted.js';
import { buildLandingDynamicZone } from './landingContent.js';

loadMigrationEnv();

const LOCALES = /** @type {const} */ (['de', 'en']);

/** Default execution order when multiple `--only` steps are given. */
const STEP_ORDER = /** @type {const} */ (['meta', 'personnel', 'privacy', 'announcements', 'landing']);

/** Alternate CLI names → canonical step id. */
const STEP_ALIASES = /** @type {Record<string, (typeof STEP_ORDER)[number]>} */ ({
	meta: 'meta',
	personnel: 'personnel',
	persons: 'personnel',
	team: 'personnel',
	privacy: 'privacy',
	datenschutz: 'privacy',
	announcements: 'announcements',
	news: 'announcements',
	landing: 'landing',
	page: 'landing',
});

function shouldRunStep(step, requested) {
	return requested === null || requested.includes(step);
}

async function findPersonnel(client, person) {
	const params = {
		'filters[$and][0][first_name][$eq]': person.first_name,
		'filters[$and][1][last_name][$eq]': person.last_name,
		'pagination[pageSize]': 1,
	};
	for (const status of /** @type {const} */ (['published', 'draft'])) {
		try {
			const { data } = await client.get('/api/kipra-personnels', { params: { ...params, status } });
			const row = data?.data?.[0];
			if (row) return row;
		} catch {
			/* try next */
		}
	}
	return null;
}

async function migrateMeta(client) {
	console.log('\n[kipra-meta]');
	const payload = {
		company: META.company,
		street: META.street,
		postal: META.postal,
		city: META.city,
		phone: META.phone,
		fax: META.fax,
		email: META.email,
	};
	for (const locale of LOCALES) {
		try {
			await putSingleType(client, '/api/kipra-meta', payload, { locale });
			console.log(`  ✓ ${locale}`);
		} catch (error) {
			logStrapiError(`kipra-meta (${locale})`, error);
			throw error;
		}
	}
}

async function migratePersonnel(client) {
	console.log('\n[kipra-personnels]');
	for (const person of PERSONNEL) {
		let row = await findPersonnel(client, person);
		try {
			const payload = {
				first_name: person.first_name,
				last_name: person.last_name,
				position: person.position,
			};

			if (!row) {
				row = await postCollection(client, '/api/kipra-personnels', payload, {
					status: 'published',
				});
				console.log(`  + ${person.first_name} ${person.last_name} → ${row.documentId}`);
			} else {
				await putCollectionDocument(client, '/api/kipra-personnels', row.documentId, payload, {
					status: 'published',
				});
				console.log(`  · ${person.first_name} ${person.last_name}`);
			}
		} catch (error) {
			logStrapiError(`${person.first_name} ${person.last_name}`, error);
			throw error;
		}
	}
}

async function migratePrivacy(client) {
	console.log('\n[kipra-page-datenschutzerklaerung]');
	for (const locale of LOCALES) {
		const title = PRIVACY_TITLE[locale];
		const body = locale === 'de' ? PRIVACY_BODY_DE : PRIVACY_BODY_EN;
		const blocks = simpleMarkdownToBlocks(body);
		try {
			await putSingleType(
				client,
				'/api/kipra-page-datenschutzerklaerung',
				{ title, content: blocks },
				{ locale, status: 'published' },
			);
			console.log(`  ✓ ${locale}`);
		} catch (error) {
			logStrapiError(`privacy (${locale})`, error);
			throw error;
		}
	}
}

async function migrateAnnouncement(client) {
	console.log('\n[kipra-announcements]');

	let row = await findCollectionFirst(
		client,
		'/api/kipra-announcements',
		{ title: { $eq: ANNOUNCEMENT_TITLE.de } },
		{ locale: 'de' },
	);

	const dePayload = {
		is_urgent: ANNOUNCEMENT_IS_URGENT,
		title: ANNOUNCEMENT_TITLE.de,
		content: simpleMarkdownToBlocks(ANNOUNCEMENT_BODY_DE),
	};

	try {
		if (!row) {
			row = await postCollection(client, '/api/kipra-announcements', dePayload, {
				locale: 'de',
				status: 'published',
			});
			console.log(`  + created (${row.documentId})`);
		} else {
			await putCollectionDocument(client, '/api/kipra-announcements', row.documentId, dePayload, {
				locale: 'de',
				status: 'published',
			});
			console.log(`  · updated de (${row.documentId})`);
		}

		const documentId = row?.documentId;
		if (!documentId) throw new Error('Announcement missing documentId');

		await putCollectionDocument(
			client,
			'/api/kipra-announcements',
			documentId,
			{
				title: ANNOUNCEMENT_TITLE.en,
				content: simpleMarkdownToBlocks(ANNOUNCEMENT_BODY_EN),
			},
			{ locale: 'en', status: 'published' },
		);
		console.log('  · updated en');
	} catch (error) {
		logStrapiError('announcement', error);
		throw error;
	}
}

async function migrateLanding(client) {
	console.log('\n[kipra-page-landing]');
	for (const locale of LOCALES) {
		const content = buildLandingDynamicZone(locale);
		try {
			await putSingleType(
				client,
				'/api/kipra-page-landing',
				{ content },
				{ locale, status: 'published' },
			);
			console.log(`  ✓ ${locale} (${content.length} blocks)`);
		} catch (error) {
			logStrapiError(`landing (${locale})`, error);
			throw error;
		}
	}
}

async function main() {
	const argv = process.argv.slice(2);
	if (argv.some((a) => a === '-h' || a === '--help')) {
		printHelpAndExit();
	}

	const baseURL = normalizeStrapiUrl(
		process.env.STRAPI_URL || process.env.PUBLIC_STRAPI_URL || '',
	);
	if (!baseURL) {
		console.error('STRAPI_URL is not set (see migration/.env.example).');
		process.exit(1);
	}

	const requested = mergeOnlyFlags(parseOnlySegments(argv));
	if (requested !== null && requested.length === 0) {
		console.error('`--only` must list at least one step. Try --help.');
		process.exit(1);
	}

	const client = createStrapiClient({ baseURL });
	console.log(`Target: ${baseURL}`);
	if (requested) {
		console.log(`Limited run: ${requested.join(' → ')}`);
	}

	for (const step of STEP_ORDER.filter((s) => shouldRunStep(s, requested))) {
		switch (step) {
			case 'meta':
				await migrateMeta(client);
				break;
			case 'personnel':
				await migratePersonnel(client);
				break;
			case 'privacy':
				await migratePrivacy(client);
				break;
			case 'announcements':
				await migrateAnnouncement(client);
				break;
			case 'landing':
				await migrateLanding(client);
				break;
			default:
				throw new Error(`Unhandled step ${/** @type {string} */ (step)}`);
		}
	}

	console.log('\n✓ Migration finished.');
}

/**
 * Reads every `--only=…` and `--only …`; combines & dedupes.
 * @returns {null | typeof STEP_ORDER[number][]} null = full run.
 */
function parseOnlySegments(argv) {
	const fragments = [];

	for (let i = 0; i < argv.length; i++) {
		const raw = argv[i];
		let list = '';

		if (raw === '--only' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
			list = argv[i + 1];
			i += 1;
		} else if (raw.startsWith('--only=')) {
			list = raw.slice('--only='.length);
		}

		if (!list) continue;

		fragments.push(
			list
				.split(',')
				.map((s) => s.trim().toLowerCase())
				.filter(Boolean),
		);
	}

	return fragments.length ? fragments : null;
}

function mergeOnlyFlags(groups) {
	if (!groups) return null;

	const seen = new Set();
	const out = [];

	for (const tokens of groups) {
		for (const tok of tokens) {
			const step = STEP_ALIASES[tok];
			if (!step || !STEP_ORDER.includes(step)) {
				console.error(
					`Unknown step "${tok}". Use --help for meta, personnel, privacy, announcements, landing.`,
				);
				process.exit(1);
			}
			if (!seen.has(step)) {
				seen.add(step);
				out.push(step);
			}
		}
	}

	out.sort((a, b) => STEP_ORDER.indexOf(a) - STEP_ORDER.indexOf(b));
	return out;
}

function printHelpAndExit() {
	console.log(`Usage:
  node migrate-content.js                             # full pipeline
  node migrate-content.js --only=personnel
  node migrate-content.js --only news --only landing
  node migrate-content.js --only announcements,landing

Steps (always executed in pipeline order):

  meta            kipra-meta
  personnel       aliases: persons, team
  privacy         aliases: datenschutz
  announcements   aliases: news
  landing         aliases: page

Via npm pass arguments after '--':
  npm run migrate:content -- --only=personnel
`);
	process.exit(0);
}

main().catch((error) => {
	console.error(error?.message ?? error);
	process.exit(1);
});
