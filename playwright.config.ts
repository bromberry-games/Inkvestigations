import { devices, type PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';


const local_config: PlaywrightTestConfig = {

  	fullyParallel: true,
  	forbidOnly: !!process.env.CI,
  	retries: process.env.CI ? 2 : 0,
  	workers: process.env.CI ? 1 : undefined,
  	reporter: 'html',

  	use: {
  	  baseURL: "http://localhost:4173",
  	  trace: 'on-first-retry',
  	},
  	// Configure projects for major browsers.
  	projects: [
  	  	{
  	  	  	name: 'chromium',
  	  	  	use: { 
				...devices['Desktop Chrome'],
        		storageState: 'playwright/.auth/user.json',
			},
  	  	},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'playwright/.auth/user.json',
			}
		},
		{
      		name: 'Mobile Chrome',
      		use: { 
				...devices['Pixel 5'], 
				isMobile: true,
				storageState: 'playwright/.auth/user.json',
			},
    	},
  	],
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

const dev_config: PlaywrightTestConfig = {

  	fullyParallel: true,
  	forbidOnly: !!process.env.CI,
  	retries: process.env.CI ? 2 : 0,
  	workers: process.env.CI ? 1 : undefined,
  	reporter: 'html',

  	use: {
  	  baseURL: "https://dev.mystery-svelte.pages.dev",
  	  trace: 'on-first-retry',
  	},
  	// Configure projects for major browsers.
  	projects: [
    	{ name: 'setup', testMatch: /.*\.setup\.ts/ },
  	  	{
  	  	  	name: 'chromium',
  	  	  	use: { 
				...devices['Desktop Chrome'],
        		storageState: 'playwright/.auth/user.json',
			},
      		dependencies: ['setup'],
  	  	},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'playwright/.auth/user.json',
			},
      		dependencies: ['setup'],
		},
		{
      		name: 'Mobile Chrome',
      		use: { 
				...devices['Pixel 5'], 
				isMobile: true,
				storageState: 'playwright/.auth/user.json',
			},
      		dependencies: ['setup'],
    	},
  	],
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

const config = process.env.ENV_TO_TEST == 'DEV' ? dev_config : local_config;
export default config;
