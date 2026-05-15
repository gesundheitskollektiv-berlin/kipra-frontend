import translation_de from '$lib/i18n/de.json';
import translation_en from '$lib/i18n/en.json';

export const SUPPORTED_LOCALES = ['de', 'en'];
export const PRERENDER_LOCALES = ['de', 'en'];
export const DEFAULT_LOCALE = 'de';

export function isValidLocale(locale) {
	return SUPPORTED_LOCALES.includes(locale);
}

export function getValidLocale(locale) {
	return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocaleName(locale) {
	const localeNames = {
		de: 'Deutsch',
		en: 'English'
	};
	return localeNames[locale] || locale;
}

export const t = (locale) => {
	if (locale === 'en') return translation_en;
	return translation_de;
};
