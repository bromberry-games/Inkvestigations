import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
	await page.setExtraHTTPHeaders({
		'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID,
		'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET
	});

	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

	await page.context().storageState({ path: authFile });
});
