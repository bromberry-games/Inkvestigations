import { devices, type PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';

const commonConfig: PlaywrightTestConfig = {
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 1,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

function createBaseProjects(additionalName: string) {
	return [
		{
			name: `chromium ${additionalName}`,
			use: {
				...devices['Desktop Chrome']
			}
		},
		{
			name: `firefox ${additionalName}`,
			use: {
				...devices['Desktop Firefox']
			}
		},
		{
			name: `Mobile Chrome ${additionalName}`,
			use: {
				...devices['Pixel 5'],
				isMobile: true
			}
		}
	];
}

function addTestMatches(projects) {
	return projects.map((project) => {
		return {
			...project,
			testMatch: /.*login.spec.ts/
		};
	});
}

function addStorageStates(projects) {
	return projects.map((project) => {
		return {
			...project,
			use: {
				...project.use,
				storageState: 'playwright/.auth/user.json'
			}
		};
	});
}

function addTestIgnores(projects) {
	return projects.map((project) => {
		return {
			...project,
			testIgnore: /.*login.spec.ts/
		};
	});
}

function addDependencies(projects, dependencies: string[]) {
	return projects.map((project) => {
		return {
			...project,
			dependencies: dependencies
		};
	});
}

const localLogin = addTestMatches(createBaseProjects(' login'));
const localElse = addDependencies(addTestIgnores(addStorageStates(createBaseProjects(''))), ['setup login']);
const local_config: PlaywrightTestConfig = {
	...commonConfig,
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry'
	},
	// Configure projects for major browsers.
	projects: [...localLogin, { name: 'setup login', testMatch: /.*login\.setup\.ts/ }, ...localElse]
	//webServer: {
	//	command: 'npm run build && npm run preview',
	//	port: 4173
	//},
};

const loginDev = addDependencies(addTestMatches(addStorageStates(createBaseProjects('login'))), ['setup_cloudflare_access']);
const dev_config: PlaywrightTestConfig = {
	...commonConfig,

	use: {
		baseURL: 'https://dev.mystery-svelte.pages.dev',
		trace: 'on-first-retry'
	},

	projects: [{ name: 'setup_cloudflare_access', testMatch: /.*auth\.setup\.ts/ }, ...loginDev]
};

const config = process.env.ENV_TO_TEST == 'DEV' ? dev_config : local_config;
console.log(config);
console.log(config.projects);
export default config;
