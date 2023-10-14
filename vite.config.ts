import { sveltekit } from '@sveltejs/kit/vite';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vitest/config';
import svg from '@poppanator/sveltekit-svg'

export default defineConfig({
	server: {
		fs: {
      		allow: [
      		  searchForWorkspaceRoot(process.cwd()),
      		],
    	},
	},
	plugins: [sveltekit(), svg()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
});
