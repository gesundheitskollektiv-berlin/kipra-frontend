/**
 * Load env for migration scripts: **kipra-frontend** app root first (where Svelte/Vite read `.env`),
 * then `migration/` extras. Maps `PUBLIC_STRAPI_URL` → `STRAPI_URL` when the latter is unset.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeStrapiUrl } from './api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** `new_websites/kipra-frontend` (parent of `migration/`). */
export const KIPRA_FRONTEND_ROOT = path.resolve(__dirname, '..');

export function loadMigrationEnv() {
	dotenv.config({ path: path.join(KIPRA_FRONTEND_ROOT, '.env') });
	dotenv.config({ path: path.join(KIPRA_FRONTEND_ROOT, '.env.local'), override: true });

	dotenv.config({ path: path.join(__dirname, '.env') });
	dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

	const strapi = (process.env.STRAPI_URL ?? '').trim();
	const publicStrapi = (process.env.PUBLIC_STRAPI_URL ?? '').trim();
	if (!strapi && publicStrapi) {
		process.env.STRAPI_URL = normalizeStrapiUrl(publicStrapi);
	}

	const tok =
		(process.env.STRAPI_AUTH_TOKEN ?? '').trim() ||
		(process.env.STRAPI_TOKEN ?? '').trim();
	if (tok && !(process.env.STRAPI_AUTH_TOKEN ?? '').trim()) {
		process.env.STRAPI_AUTH_TOKEN = tok;
	}
}
