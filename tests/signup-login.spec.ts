import { test, expect, type Page } from '@playwright/test';

async function loginOnPage(page: Page, isMobile: boolean) {
	await page.evaluate(() => document.fonts.ready);
	await page.goto('/', { waitUntil: 'load' });
	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'Login' }).click();
	await page.waitForLoadState('domcontentloaded');
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill('test@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

async function logoutOfPage(page: Page, isMobile: boolean) {
	await page.locator('#avatar-menu').click();
	await page.getByRole('button', { name: 'Sign out' }).click();

	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
}

test('login', async ({ page, isMobile }) => {
	await loginOnPage(page, isMobile);

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('logout', async ({ page, isMobile }) => {
	await loginOnPage(page, isMobile);
	await logoutOfPage(page, isMobile);

	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
});

test('login logout and login should redirect', async ({ page, isMobile }) => {
	await loginOnPage(page, isMobile);
	await logoutOfPage(page, isMobile);
	await loginOnPage(page, isMobile);
	await page.waitForURL('/mysteries');

	await expect(new URL(page.url()).pathname).toBe('/mysteries');
});
