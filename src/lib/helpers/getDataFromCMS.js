import { building } from '$app/environment';
import { env } from '$env/dynamic/public';
import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';

const cache = new Map();

const shouldUseCache = () => building && env.PUBLIC_PREVIEW_MODE !== 'true';

const fetchData = async (url, fetchFn = fetch) => {
	if (shouldUseCache() && cache.has(url)) {
		return cache.get(url);
	}

	const response = await fetchFn(url);
	const data = await response.json();

	if (shouldUseCache()) {
		cache.set(url, data);
	}

	return data;
};

// Media / blocks populate poorly with pLevel alone — use populate=* (like geko-materials).
const useStarPopulate = ['kipra-materials'];

export async function getDataFromCMS(path, locale, fetchFn = fetch) {
	const base = getStrapiPublicUrl();
	if (!base) {
		console.error('[getDataFromCMS] PUBLIC_STRAPI_URL is missing');
		return { data: null };
	}

	const shouldFetchAllPages = ['kipra-personnels', 'kipra-materials'];

	if (shouldFetchAllPages.includes(path)) {
		return await fetchAllPages(path, locale, fetchFn, base);
	}

	const queryUrl = `${base}/api/${path}?pLevel&locale=${locale}`;
	return await fetchData(queryUrl, fetchFn);
}

async function fetchAllPages(path, locale, fetchFn = fetch, baseUrl = getStrapiPublicUrl()) {
	let allData = [];
	let currentPage = 1;
	let totalPages = 1;

	const populateParam = useStarPopulate.includes(path) ? 'populate=*' : 'pLevel';
	const personnelSort = '&sort=last_name:asc';

	do {
		const sortAndPagination =
			path === 'kipra-personnels'
				? `${personnelSort}&pagination[page]=${currentPage}&pagination[pageSize]=100`
				: `&pagination[page]=${currentPage}&pagination[pageSize]=100`;

		const queryUrl = `${baseUrl}/api/${path}?${populateParam}&locale=${locale}${sortAndPagination}`;
		const result = await fetchData(queryUrl, fetchFn);

		if (result?.data) {
			allData = allData.concat(result.data);

			if (result.meta?.pagination) {
				totalPages = result.meta.pagination.pageCount;
			}
		}

		currentPage++;
	} while (currentPage <= totalPages);

	return {
		data: allData,
		meta: {
			pagination: {
				page: 1,
				pageSize: allData.length,
				pageCount: 1,
				total: allData.length
			}
		}
	};
}
