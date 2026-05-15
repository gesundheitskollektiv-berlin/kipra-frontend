import { simpleMarkdownToBlocks } from './mdToBlocks.js';
import {
	EMPFEHLUNGEN_MD,
	KONTAKT_MD,
	TERMINE_MD,
	UEBER_UNS_MD,
	WELCOME_MD,
} from './data/markdownBodies.js';
import { buildSprechstundenDynamicZone } from './sprechstundenData.js';

const WELCOME_TITLES = {
	de: 'Willkommen in der Berghafenpraxis',
	en: 'Welcome to Berg-Hafen-Praxis',
};

const ANNOUNCEMENT_SECTION_TITLE = {
	de: 'Hinweise aus der Praxis',
	en: 'Practice notices',
};

/**
 * Landing dynamic zone payload (whole `content` array), plan order variant:
 * welcome → announcements strip → sprechstunden → termine → contact → about → services → footer.
 * @param {'de'|'en'} locale
 */
export function buildLandingDynamicZone(locale) {
	const sprechBlock = buildSprechstundenDynamicZone(locale);
	const en = locale === 'en';

	return [
		{
			__component: 'kipra-page-blocks.welcome',
			title: WELCOME_TITLES[locale],
			navbar_link: false,
			background_color: 'yellow',
			content: simpleMarkdownToBlocks(WELCOME_MD[locale]),
		},
		{
			__component: 'kipra-page-blocks.announcements',
			title: ANNOUNCEMENT_SECTION_TITLE[locale],
			background_color: 'white',
		},
		sprechBlock,
		{
			__component: 'kipra-page-blocks.termine',
			title: en ? 'Appointments' : 'Termine',
			background_color: 'yellow',
			content: simpleMarkdownToBlocks(TERMINE_MD[locale]),
		},
		{
			__component: 'kipra-page-blocks.contact',
			title: en ? 'Contact' : 'Kontakt',
			navbar_link: true,
			navbar_link_title: en ? 'Contact' : 'Kontakt',
			background_color: 'white',
			content: simpleMarkdownToBlocks(KONTAKT_MD[locale]),
		},
		{
			__component: 'kipra-page-blocks.about',
			title: en ? 'About us' : 'Über uns',
			navbar_link: true,
			navbar_link_title: en ? 'About us' : 'Über uns',
			background_color: 'yellow',
			content: simpleMarkdownToBlocks(UEBER_UNS_MD[locale]),
		},
		{
			__component: 'kipra-page-blocks.services',
			title: en ? 'Recommendations and resources' : 'Empfehlungen und Informationen',
			navbar_link: false,
			background_color: 'purple',
			content: simpleMarkdownToBlocks(EMPFEHLUNGEN_MD[locale]),
		},
		{
			__component: 'kipra-page-blocks.footer',
			background_color: 'green',
		},
	];
}
