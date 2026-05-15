import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter({ runtime: 'nodejs22.x' }),
		prerender: {
			handleUnseenRoutes: 'warn',
			handleMissingId: 'warn',
			handleHttpError: 'warn'
		}
	}
};

export default config;
