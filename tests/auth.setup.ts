import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
	const clientId = process.env.CF_ACCESS_CLIENT_ID;
	const secret = process.env.CF_ACCESS_CLIENT_SECRET;
	if (!clientId || !secret) {
		throw new Error('Missing CF_ACCESS_CLIENT_ID or CF_ACCESS_CLIENT_SECRET');
	}
	await page.setExtraHTTPHeaders({
		'CF-Access-Client-Id': clientId,
		'CF-Access-Client-Secret': secret
	});

	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

	await page.context().storageState({ path: authFile });
});
