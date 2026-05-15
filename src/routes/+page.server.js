import { redirect } from '@sveltejs/kit';
import { DEFAULT_LOCALE } from '$lib/helpers/translation';

export function load() {
	throw redirect(307, `/${DEFAULT_LOCALE}`);
}
