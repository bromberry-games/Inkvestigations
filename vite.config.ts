import { sveltekit } from '@sveltejs/kit/vite';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
		fs: {
      		allow: [
      		  searchForWorkspaceRoot(process.cwd()),
      		],
    },
    proxy: {
      '/api': 'http://localhost:8000',
	}},
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
});
