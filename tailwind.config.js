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
        		'primary': '#a05e2a',
        		'secondary': '#99785e',
        		'tertiary': '#efdfbb',
				'quaternary': '#3c3c3c',
				'chief': '#dcb98c',
      		},
			fontFamily: {
        		'primary': ['Oswald', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'secondary': ['Zilla Slab', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'tertiary': ['Abril Fatface', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      		},
			 backgroundImage: {
        		'message-counter': "url('/static/images/message_counter.svg')",
      		}
    	},
	},

	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;