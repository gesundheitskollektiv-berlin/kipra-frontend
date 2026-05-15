/**
 * Migration: Sprechzeiten (DE + EN) -> kipra-page-landing
 *
 * Hand-codes the legacy markdown content from
 *   geko-allgemeinarzt/collections/_blocks/de/sprechzeiten.md
 * and PUTs it onto kipra-page-landing's `kipra-page-blocks.sprechstunden`
 * dynamic-zone block, for both `de` and `en` locales.
 *
 * Personnel rows (kipra-personnels) are ensured by last_name from the legacy
 * About page + sprechzeiten doctors. Missing rows are POSTed (no images).
 * Slot relations still key off last_name for the five doctors in the schedule.
 *
 * Usage:
 *   1. Ensure ../.env has PUBLIC_STRAPI_URL pointing at the right Strapi
 *      (or override via process env: PUBLIC_STRAPI_URL=http://localhost:1337 ...).
 *   2. STRAPI_TOKEN=<token> node migrate-sprechzeiten.js
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createStrapiClient } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const STRAPI_URL = process.env.PUBLIC_STRAPI_URL
  ? process.env.PUBLIC_STRAPI_URL.replace(/^['"]|['"]$/g, '').trim()
  : '';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';
const TARGET_COMPONENT = 'kipra-page-blocks.sprechstunden';
const LOCALES = ['de', 'en'];

if (!STRAPI_URL) {
  console.error('PUBLIC_STRAPI_URL is not set. Configure kipra-frontend/.env or pass it inline.');
  process.exit(1);
}

if (!STRAPI_TOKEN) {
  console.warn('Warning: STRAPI_TOKEN not set. Authenticated PUTs will likely fail.');
}

const api = createStrapiClient(STRAPI_URL, STRAPI_TOKEN);

const PERSONNEL = [
  { last_name: 'Schubert', first_name: 'Kirsten', position: 'Fachärztin für Allgemeinmedizin' },
  { last_name: 'Barra', first_name: 'Jay', position: 'Ärzt in Weiterbildung' },
  { last_name: 'Henatsch', first_name: 'Johanna', position: 'Fachärztin für Innere Medizin' },
  { last_name: 'Rickers', first_name: 'Johanna', position: 'Fachärztin für Allgemeinmedizin' },
  { last_name: 'Osman', first_name: 'Kesrau', position: 'Arzt in Weiterbildung' },
  { last_name: 'Bedel', first_name: 'Rosi', position: 'Medizinische Fachangestellte (MFA)' },
  { last_name: 'Petrovics', first_name: 'Eszter', position: 'Praktikantin zur MFA' },
  { last_name: 'Strankowska', first_name: 'Ewa', position: 'Praxismanagerin' },
  { last_name: 'Dinckar', first_name: 'Seher', position: 'Medizinische Fachangestellte (MFA)' },
  { last_name: 'Otay', first_name: 'Ülker', position: 'Medizinische Fachangestellte (MFA)' },
];
const DAYS_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
const DAY_DE_TO_EN = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
};
const SLOT_DESC_DE_TO_EN = {
  Vormittag: 'Morning',
  Nachmittag: 'Afternoon',
};

const INFEKT_TYPE_DE =
  'Infektsprechstunde (bitte kommen Sie mit Infekten wie Halsschmerzen, Husten, Fieber, Schnupfen, Magendarm... ausschließlich um 8.30Uhr!)';
const INFEKT_TYPE_EN =
  'Infection consultation (please come with infections such as sore throat, cough, fever, runny nose, gastrointestinal... only at 8:30 AM!)';
const INFEKT_NOTICE_DE = 'Infektsprechstunde Mo-Fr um 8:30 Uhr mit FFP2 Maske';
const INFEKT_NOTICE_EN = 'Infection consultation Mon-Fri at 8:30 AM with FFP2 mask';

// schedule[day] = { Vormittag: { time, doctors[] } | null, Nachmittag: ... | null }
const AKUT_SCHEDULE = {
  Montag: {
    Vormittag: { time: '9-10', doctors: ['Schubert', 'Barra', 'Henatsch'] },
    Nachmittag: null,
  },
  Dienstag: {
    Vormittag: { time: '9-10', doctors: ['Rickers', 'Osman'] },
    Nachmittag: { time: '15-16', doctors: ['Henatsch', 'Barra'] },
  },
  Mittwoch: {
    Vormittag: { time: '9-10', doctors: ['Rickers', 'Henatsch'] },
    Nachmittag: { time: '15-16', doctors: ['Rickers', 'Osman', 'Barra'] },
  },
  Donnerstag: {
    Vormittag: { time: '9-10', doctors: ['Schubert', 'Osman'] },
    Nachmittag: { time: '15-16', doctors: ['Schubert', 'Osman'] },
  },
  Freitag: {
    Vormittag: { time: '9-10', doctors: ['Schubert', 'Rickers'] },
    Nachmittag: null,
  },
};

const TERMIN_SCHEDULE = {
  Montag: {
    Vormittag: { time: '10:15-12', doctors: ['Schubert', 'Henatsch', 'Barra'] },
    Nachmittag: null,
  },
  Dienstag: {
    Vormittag: { time: '10:15-12', doctors: ['Rickers', 'Osman'] },
    Nachmittag: { time: '16:15-18', doctors: ['Henatsch', 'Barra'] },
  },
  Mittwoch: {
    Vormittag: { time: '10:15-12', doctors: ['Rickers', 'Henatsch'] },
    Nachmittag: { time: '16:15-18', doctors: ['Rickers', 'Osman', 'Barra'] },
  },
  Donnerstag: {
    Vormittag: { time: '10:15-12', doctors: ['Schubert', 'Osman'] },
    Nachmittag: { time: '16:15-17', doctors: ['Henatsch', 'Schubert', 'Osman'] },
  },
  Freitag: {
    Vormittag: { time: '10:15-12', doctors: ['Schubert', 'Rickers'] },
    Nachmittag: null,
  },
};

function parseTime(timeStr) {
  if (!timeStr || timeStr === '-') return null;
  const [start, end] = timeStr.split('-').map((s) => s.trim());
  return { start, end };
}

function italicParagraph(text) {
  return [
    {
      type: 'paragraph',
      children: [{ type: 'text', text, italic: true }],
    },
  ];
}

function buildSlots(daySchedule, doctorIds, locale) {
  const slots = [];
  for (const desc of ['Vormittag', 'Nachmittag']) {
    const data = daySchedule[desc];
    if (!data) continue;
    const parsed = parseTime(data.time);
    if (!parsed) continue;
    const docIds = (data.doctors || []).map((n) => doctorIds[n]).filter(Boolean);
    slots.push({
      description: locale === 'en' ? SLOT_DESC_DE_TO_EN[desc] : desc,
      start: parsed.start,
      end: parsed.end,
      doctors: docIds,
    });
  }
  return slots;
}

function buildSchedule(typeDe, typeEn, schedule, doctorIds, locale) {
  const isEn = locale === 'en';
  const days = DAYS_DE.map((day) => ({
    day: isEn ? DAY_DE_TO_EN[day] : day,
    sprechzeiten: buildSlots(schedule[day], doctorIds, locale),
  })).filter((d) => d.sprechzeiten.length > 0);

  return {
    type: isEn ? typeEn : typeDe,
    days,
  };
}

function buildSprechstundenBlock(doctorIds, locale) {
  const isEn = locale === 'en';
  const sprechstunden = [
    {
      type: isEn ? INFEKT_TYPE_EN : INFEKT_TYPE_DE,
      description: italicParagraph(isEn ? INFEKT_NOTICE_EN : INFEKT_NOTICE_DE),
      days: [],
    },
    buildSchedule(
      'Akutsprechstunde (ohne Termin)',
      'Walk-in consultation (no appointment)',
      AKUT_SCHEDULE,
      doctorIds,
      locale,
    ),
    buildSchedule(
      'Terminsprechstunde',
      'Scheduled consultation',
      TERMIN_SCHEDULE,
      doctorIds,
      locale,
    ),
  ];

  return {
    __component: TARGET_COMPONENT,
    title: isEn ? 'Consultation hours' : 'Sprechzeiten',
    navbar_link: true,
    navbar_link_title: isEn ? 'Consultation hours' : 'Sprechzeiten',
    background_color: 'blue',
    sprechstunden,
  };
}

function buildPersonnelPayload(person) {
  return {
    last_name: person.last_name,
    first_name: person.first_name ?? '',
    position: person.position ?? null,
  };
}

function fieldsMatch(entry, person) {
  const expected = buildPersonnelPayload(person);
  return (
    (entry?.last_name ?? '') === expected.last_name &&
    (entry?.first_name ?? '') === expected.first_name &&
    (entry?.position ?? null) === expected.position
  );
}

async function findPersonnelByLastName(lastName) {
  // Look for any entry (published OR draft) whose published last_name matches.
  // If the last_name was lost by Strapi v5 quirks (only first_name/position survived),
  // we fall back to listing ALL personnel and matching on the draft side.
  for (const status of ['published', 'draft']) {
    try {
      const { data } = await api.get('/api/kipra-personnels', {
        params: {
          'filters[last_name][$eq]': lastName,
          'pagination[pageSize]': 1,
          status,
        },
      });
      if (data?.data?.length) {
        return data.data[0];
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.message;
      console.warn(`  ! Lookup error for ${lastName} (${status}): ${msg}`);
    }
  }
  return null;
}

async function fetchPersonnelByDocumentId(documentId, status) {
  try {
    const { data } = await api.get(`/api/kipra-personnels/${documentId}`, {
      params: { status },
    });
    return data?.data ?? null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

async function repairPersonnel(documentId, person) {
  const payload = buildPersonnelPayload(person);
  await api.put(`/api/kipra-personnels/${documentId}`, { data: payload });
  await api.put(`/api/kipra-personnels/${documentId}`, { data: payload }, { params: { status: 'published' } });
}

async function createPersonnel(person) {
  const payload = buildPersonnelPayload(person);
  const { data } = await api.post(
    '/api/kipra-personnels',
    { data: payload },
    { params: { status: 'published' } },
  );

  const created = data?.data;
  if (!created?.documentId) {
    throw new Error(`POST /api/kipra-personnels failed for ${person.last_name}: no documentId in response`);
  }

  return created;
}

async function ensurePersonnelComplete(person, entry) {
  // Verify the published version actually has last_name (Strapi v5 has been observed to
  // create the entry but drop fields when first_name is empty + no position).
  const documentId = entry.documentId;
  const published = await fetchPersonnelByDocumentId(documentId, 'published');

  if (published && fieldsMatch(published, person)) {
    return { documentId, status: 'ok' };
  }

  console.warn(
    `  ! ${person.last_name}: published entry incomplete (got last_name="${published?.last_name ?? ''}", first_name="${published?.first_name ?? ''}", position="${published?.position ?? ''}") - repairing.`,
  );

  await repairPersonnel(documentId, person);

  const verified = await fetchPersonnelByDocumentId(documentId, 'published');
  if (!verified || !fieldsMatch(verified, person)) {
    throw new Error(
      `Repair failed for ${person.last_name} (${documentId}): published entry still incorrect (last_name="${verified?.last_name ?? ''}").`,
    );
  }

  return { documentId, status: 'repaired' };
}

async function ensurePersonnel() {
  console.log('\nEnsuring kipra-personnel rows (find or create by last_name)...');
  const personnelIds = {};

  for (const person of PERSONNEL) {
    let entry = await findPersonnelByLastName(person.last_name);
    let action;

    if (!entry) {
      entry = await createPersonnel(person);
      action = 'created';
    } else {
      action = 'found';
    }

    const { documentId, status } = await ensurePersonnelComplete(person, entry);
    personnelIds[person.last_name] = documentId;

    const suffix = status === 'repaired' ? ' (repaired)' : '';
    console.log(`  - ${person.last_name} (${action})${suffix} -> ${documentId}`);
  }

  return personnelIds;
}

// Recursively strip Strapi v5 internal fields from a fetched payload so it can be
// PUT back without "duplicate id" / unknown-field errors. Also collapses populated
// relations (e.g. doctors objects) down to a documentId array.
function cleanForUpdate(value) {
  if (Array.isArray(value)) {
    const first = value[0];
    if (first && typeof first === 'object' && 'documentId' in first) {
      return value.map((item) => item.documentId || item.id).filter(Boolean);
    }
    return value.map(cleanForUpdate);
  }

  if (value !== null && typeof value === 'object') {
    const {
      id: _id,
      __temp_key__: _tempKey,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      publishedAt: _publishedAt,
      locale: _locale,
      localizations: _localizations,
      ...rest
    } = value;

    const cleaned = {};
    for (const [key, val] of Object.entries(rest)) {
      cleaned[key] = cleanForUpdate(val);
    }
    return cleaned;
  }

  return value;
}

async function fetchLanding(locale) {
  try {
    const { data } = await api.get('/api/kipra-page-landing', {
      params: { locale, pLevel: '' },
    });
    return data?.data ?? null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

async function migrateLocale(locale, personnelIds, deFallbackContent) {
  console.log(`\n=== Locale: ${locale} ===`);

  const newBlock = buildSprechstundenBlock(personnelIds, locale);

  let landing = await fetchLanding(locale);

  let content;
  if (!landing) {
    if (locale === 'de') {
      throw new Error('kipra-page-landing has no DE entry - cannot proceed.');
    }
    if (!deFallbackContent) {
      console.warn(`  ! No ${locale} entry and no DE fallback available - skipping.`);
      return null;
    }
    console.log(`  ${locale} entry missing -> bootstrapping from DE content`);
    content = deFallbackContent.map(cleanForUpdate);
  } else {
    content = (landing.content ?? []).map(cleanForUpdate);
  }

  const idx = content.findIndex((b) => b && b.__component === TARGET_COMPONENT);
  if (idx >= 0) {
    content[idx] = newBlock;
    console.log('  Replaced existing Sprechstunden block.');
  } else {
    content.push(newBlock);
    console.log('  Appended new Sprechstunden block.');
  }

  try {
    await api.put('/api/kipra-page-landing', { data: { content } }, { params: { locale } });
    console.log(`  ✓ kipra-page-landing (${locale}) updated.`);
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    const details = error.response?.data?.error?.details;
    console.error(`  ✗ Update failed (${locale}): ${msg}`);
    if (details) console.error('     details:', JSON.stringify(details, null, 2));
    throw error;
  }

  return landing?.content ?? content;
}

async function main() {
  console.log(`Strapi target: ${STRAPI_URL}`);

  const personnelIds = await ensurePersonnel();

  const deLanding = await fetchLanding('de');
  if (!deLanding) {
    throw new Error('kipra-page-landing has no DE entry - aborting.');
  }
  const deOriginalContent = deLanding.content ?? [];

  await migrateLocale('de', personnelIds);
  await migrateLocale('en', personnelIds, deOriginalContent);

  console.log('\n✓ Migration complete.');
}

main().catch((error) => {
  console.error('\nMigration failed:', error.message);
  process.exit(1);
});
