import type { Page } from '@playwright/test';

export async function loginOnPage(page: Page, isMobile: boolean) {
	await page.evaluate(() => document.fonts.ready);
	await page.goto('/', { waitUntil: 'load' });
	await navToLogin(page, isMobile);
	await fillOutLoginOrSignupForm(page, isMobile, 'test-only-user@mail.com', 'password-test-user');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

export async function navToLogin(page: Page, isMobile: boolean) {
	if (isMobile) {
		await page.waitForTimeout(200);
		await page.getByLabel('bars 3').click();
	}
	await page.getByRole('link', { name: 'Login' }).click();
}

export async function fillOutLoginOrSignupForm(page: Page, isMobile: boolean, email: string, password: string) {
	await page.waitForLoadState('domcontentloaded');
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill(email);
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill(password);
}
