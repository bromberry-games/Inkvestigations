import { devices, type PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';


const config: PlaywrightTestConfig = {
  	fullyParallel: true,

  	forbidOnly: !!process.env.CI,

  	retries: process.env.CI ? 2 : 0,

  	workers: process.env.CI ? 1 : undefined,

  	reporter: 'html',

  	use: {
  	  baseURL: process.env.BASE_URL,
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
  	],
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
