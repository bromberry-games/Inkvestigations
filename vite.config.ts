import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vitest/config';
import svg from '@poppanator/sveltekit-svg';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd())]
		}
	},
	plugins: [
		// legacy({
		// targets: ['iOS >= 13.2']
		// }),
		enhancedImages(),
		sveltekit(),
		svg()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
