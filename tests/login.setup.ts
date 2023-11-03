import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'LOGIN' }).click();
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill('test-only-user@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password-test-user');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await expect(page.locator('#avatar-menu')).toBeVisible();

	await page.context().storageState({ path: authFile });
});
