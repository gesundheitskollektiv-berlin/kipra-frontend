import axios from 'axios';

/** @param {unknown} raw */
export function normalizeStrapiUrl(raw) {
	if (raw === undefined || raw === null || raw === '') return '';
	let s = String(raw).trim();
	s = s.replace(/^['"]|['"]$/g, '').trim();
	s = s.replace(/\/+$/, '');
	return s;
}

/**
 * @param {{ baseURL?: string; token?: string }=} options
 */
export function createStrapiClient(options = {}) {
	const baseURL = normalizeStrapiUrl(
		options.baseURL ??
			process.env.STRAPI_URL ??
			process.env.PUBLIC_STRAPI_URL ??
			'',
	);
	const token =
		options.token ??
		process.env.STRAPI_AUTH_TOKEN ??
		process.env.STRAPI_TOKEN ??
		'';

	const headers = { 'Content-Type': 'application/json' };
	if (token) headers.Authorization = `Bearer ${token}`;

	if (!token) {
		console.warn('Warning: STRAPI_AUTH_TOKEN is empty — requests may fail if Strapi APIs are not open.');
	}

	const timeoutMs = Number(process.env.STRAPI_REQUEST_TIMEOUT_MS ?? 60000);
	return axios.create({
		baseURL,
		headers,
		timeout: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60000,
	});
}

/** @param {string} label @param {import('axios').AxiosError | Error} error */
export function logStrapiError(label, error) {
	const axiosErr = /** @type {import('axios').AxiosError} */ (error);
	const data = axiosErr.response?.data;
	const msg =
		data?.error?.message ?? data?.message ?? axiosErr.message ?? String(error);
	console.error(`${label}: ${msg}`);
	if (data && typeof data === 'object') {
		console.error(JSON.stringify(data, null, 2));
	}
}

/**
 * @param {import('axios').AxiosInstance} client
 * @param {string} path e.g. `/api/kipra-meta`
 * @param {Record<string, unknown>=} params
 */
export async function getSingleTypeDocument(client, path, params = {}) {
	const { data } = await client.get(path, { params });
	return data?.data ?? null;
}

/**
 * @param {import('axios').AxiosInstance} client
 * @param {string} path
 * @param {Record<string, unknown>} payload `data` object body
 * @param {Record<string, unknown>=} params query (locale, status, …)
 */
export async function putSingleType(client, path, payload, params = {}) {
	const { data } = await client.put(path, { data: payload }, { params });
	return data?.data ?? null;
}

/**
 * @param {import('axios').AxiosInstance} client
 * @param {string} path e.g. `/api/kipra-personnels`
 * @param {Record<string, unknown>} filters `{ last_name: { $eq: 'Müller' }, ... }` root filters object
 */
export async function findCollectionFirst(client, path, filters, extraParams = {}) {
	const params = {
		...extraParams,
		'pagination[pageSize]': 1,
		...buildFiltersQuery(filters),
	};
	for (const status of /** @type {const} */ (['published', 'draft'])) {
		try {
			const { data } = await client.get(path, { params: { ...params, status } });
			const row = data?.data?.[0];
			if (row) return row;
		} catch (_) {
			/* try next status */
		}
	}
	return null;
}

/** Strapi `$and`/`$eq` shorthand → flattened query keys */
function buildFiltersQuery(filters, prefix = 'filters') {
	/** @type {Record<string, string | number | boolean>} */
	const out = {};
	for (const [k, v] of Object.entries(filters)) {
		if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
			Object.assign(out, buildNestedFilter(`${prefix}[${k}]`, v));
		} else {
			out[`${prefix}[${k}]`] = v;
		}
	}
	return out;
}

/** @param {string} prefix @param {Record<string, unknown>} obj */
function buildNestedFilter(prefix, obj) {
	/** @type {Record<string, string | number | boolean>} */
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		const key = `${prefix}[${k}]`;
		if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
			Object.assign(out, buildNestedFilter(key, /** @type {Record<string, unknown>} */ (v)));
		} else {
			out[key] = /** @type {string | number | boolean} */ (v);
		}
	}
	return out;
}

/**
 * @param {import('axios').AxiosInstance} client
 * @param {string} path
 */
export async function postCollection(client, path, payload, params = {}) {
	const { data } = await client.post(path, { data: payload }, { params });
	return data?.data ?? null;
}

/**
 * @param {import('axios').AxiosInstance} client
 */
export async function putCollectionDocument(client, path, documentId, payload, params = {}) {
	const { data } = await client.put(`${path}/${documentId}`, { data: payload }, { params });
	return data?.data ?? null;
}
