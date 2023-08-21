/** @type {import('tailwindcss').Config} */
//export default {
//  content: ['./src/**/*.{html,js,svelte,ts}'],
//  theme: {
//    extend: {},
//  },
//  plugins: [],
//}

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
      		colors: {
        		'custom-primary': '#a05e2a',
        		'custom-secondary': '#c8934f',
        		'custom-tertiary': '#efdfbb',
      		},
			fontFamily: {
        		'primary': ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      		}
    	},
	},

	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;