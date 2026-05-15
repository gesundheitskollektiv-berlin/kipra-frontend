import { simpleMarkdownToBlocks } from './mdToBlocks.js';

const DAYS_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const KEYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];

/** @param {string} dayLabel */
/** @param {{ start: string, end: string }[]} ranges */
function praxistag(dayLabel, ranges) {
	return {
		day: dayLabel,
		sprechzeiten: ranges.map((r) => ({
			description: null,
			start: r.start,
			end: r.end,
			doctors: []
		}))
	};
}

/**
 * Kinderpraxis times transcribed from geko-kinderpraxis `_blocks` (DE/EN `sprechzeiten.md`).
 * @param {'de' | 'en'} locale
 */
export function buildSprechstundenDynamicZone(locale) {
	const en = locale === 'en';
	const dayLabels = en ? DAYS_EN : DAYS_DE;

	const introAkut = en
		? [
				'Open consultation hour without appointment: **Only for children WITHOUT infections:** If your child has an infection such as cold, fever or hand, foot and mouth disease, please make an appointment.',
				'',
				'*(Admission until 30 minutes before the end of the consultation hour)*',
			].join('\n')
		: [
				'**Nur für Kinder OHNE Infektionen:** bei Infektionen wie z.B. Erkältung, Fieber oder Hand-Mund-Fuß bitte einen Termin vereinbaren.',
				'',
				'*(**Annahme bis 9.30 Uhr**)*',
			].join('\n');

	const introTerm = en
		? '(Preventive appointments and infectious patients — afternoons. Opening hours may change during holidays.)'
		: '(Vorsorge und PatientInnen mit Infektion (ab nachmittags). In Ferienzeiten kann es zu Änderungen der Sprechzeiten kommen.)\n\nMontag bis Donnerstag nach 16.30 Uhr ggf. NUR nach Terminvereinbarung.';

	const terminSlots = en
		? {
				Mo: [
					{ start: '10.30', end: '12.00' },
					{ start: '14.30', end: '16.30' }
				],
				Di: [{ start: '9.00', end: '16.30' }],
				Mi: [
					{ start: '10.30', end: '12.00' },
					{ start: '15.00', end: '16.30' }
				],
				Do: [{ start: '10.30', end: '16.30' }],
				Fr: [{ start: '10.30', end: '14.00' }]
			}
		: {
				Mo: [
					{ start: '10.30', end: '12.00' },
					{ start: '14.30', end: '16.30' }
				],
				Di: [
					{ start: '10.30', end: '12.30' },
					{ start: '14.00', end: '16.30' }
				],
				Mi: [
					{ start: '10.30', end: '12.00' },
					{ start: '15.00', end: '16.30' }
				],
				Do: [
					{ start: '10.30', end: '12.30' },
					{ start: '14.00', end: '16.30' }
				],
				Fr: [{ start: '10.30', end: '13.00' }]
			};

	const sprechstunden = [];

	sprechstunden.push({
		type: en ? 'Open consultation (walk-in)' : 'Offene Sprechstunde ohne Termin',
		description: simpleMarkdownToBlocks(introAkut),
		days: KEYS.map((_, i) => praxistag(dayLabels[i], [{ start: '9.00', end: '9.30' }]))
	});

	sprechstunden.push({
		type: en ? 'Scheduled appointments' : 'Terminsprechstunde',
		description: simpleMarkdownToBlocks(introTerm),
		days: KEYS.map((k, i) => praxistag(dayLabels[i], terminSlots[k]))
	});

	if (!en) {
		sprechstunden.push({
			type: 'Telefonsprechzeiten',
			description: simpleMarkdownToBlocks('**Telefonsprechzeiten:** +4930–33953131'),
			days: [
				praxistag('Mo–Mi', [{ start: '10.30', end: '11.30' }]),
				praxistag('Do–Fr', [{ start: '07.30', end: '08.30' }]),
				praxistag('Montag', [{ start: '14.00', end: '15.00' }]),
				praxistag('Mittwoch', [{ start: '15.30', end: '16.30' }])
			]
		});
	}

	return {
		__component: 'kipra-page-blocks.sprechstunden',
		title: en ? 'Consultation hours' : 'Sprechzeiten',
		navbar_link: true,
		navbar_link_title: en ? 'Consultation hours' : 'Sprechzeiten',
		background_color: 'purple',
		sprechstunden
	};
}
