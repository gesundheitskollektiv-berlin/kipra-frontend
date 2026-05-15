import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale } from '$lib/helpers/translation';

export async function load({ params, fetch }) {
	const locale = getValidLocale(params.locale);

	const data = {};

	const endpoints = [
		'kipra-page-landing',
		'kipra-meta',
		'kipra-announcements',
		'kipra-personnels',
		'kipra-materials'
	];

	for (const endpoint of endpoints) {
		try {
			data[endpoint] = await getDataFromCMS(endpoint, locale, fetch);
		} catch (err) {
			console.error(`[layout.server] Failed to fetch ${endpoint}:`, err);
			data[endpoint] = { data: null };
		}
	}

	data['locale'] = locale;

	return data;
}
