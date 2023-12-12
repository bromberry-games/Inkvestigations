import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { createNeUserAndLoginViaUrl, createRandomUser, loginOnPage } from '../tests/helpers';

export * from '@playwright/test';
// export const test = baseTest.extend<{}, { workerStorageState: string }>({
//Use the same storage state for all tests in this worker.
// storageState: ({ workerStorageState, baseURL }, use) => use(workerStorageState),
//
//Authenticate once per worker with a worker-scoped fixture.
// workerStorageState: [
// async ({ browser, baseURL }, use) => {
//Use parallelIndex as a unique identifier for each worker.
// const id = test.info().parallelIndex;
// const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
//
// if (fs.existsSync(fileName)) {
//Reuse existing authentication state if any.
// console.log(fileName);
// await use(fileName);
// return;
// }
//Important: make sure we authenticate in a clean environment by unsetting storage state.
// const page = await browser.newPage({ storageState: undefined });
// console.log(page.baseURL);
//
// await createNeUserAndLoginViaUrl(page, 'http://localhost:5173');
//Perform authentication steps. Replace these actions with your own.
// await page.waitForTimeout(1000);
//
// await page.context().storageState({ path: fileName });
// await page.close();
// await use(fileName);
// },
// { scope: 'worker' }
// ]
// });
//
type Account = {
	email: string;
	password: string;
	userId: string;
};
export const test = baseTest.extend<{}, { account: Account }>({
	account: [
		async ({ browser }, use, workerInfo) => {
			const user = await createRandomUser();
			await use(user);
		},
		{ scope: 'worker' }
	],

	page: async ({ page, account, isMobile }, use) => {
		await loginOnPage(page, isMobile, account.email, account.password);
		await expect(page.locator('#avatar-menu')).toBeVisible();

		await use(page);
	}
});
