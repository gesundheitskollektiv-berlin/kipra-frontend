import { env } from '$env/dynamic/public';

/**
 * Strapi base URL (no trailing slash).
 * Uses $env/dynamic/public so PUBLIC_STRAPI_URL is read at runtime on the server
 * and in the browser — not only inlined at `vite build`. On Vercel, set
 * PUBLIC_STRAPI_URL for Production (and Preview) and for **Build** if prerender hits the CMS.
 */
export function getStrapiPublicUrl() {
	const raw = env.PUBLIC_STRAPI_URL;
	if (raw == null || String(raw).trim() === '') {
		return '';
	}
	return String(raw).replace(/\/$/, '');
}
