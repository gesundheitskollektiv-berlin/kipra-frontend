import { PRERENDER_LOCALES } from '$lib/helpers/translation';

/** @returns {Promise<{ locale: string }[]>} */
export async function entries() {
	return PRERENDER_LOCALES.map((locale) => ({ locale }));
}
