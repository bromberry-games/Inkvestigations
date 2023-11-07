import type { Page } from '@playwright/test';

export async function loginOnPage(page: Page, isMobile: boolean) {
	await page.evaluate(() => document.fonts.ready);
	await page.goto('/', { waitUntil: 'load' });
	if (isMobile) {
		await page.waitForTimeout(200);
		await page.getByLabel('bars 3').click();
	}
	await page.getByRole('link', { name: 'Login' }).click();
	await page.waitForLoadState('domcontentloaded');
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill('test-only-user@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password-test-user');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}
