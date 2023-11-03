import { test, expect } from '@playwright/test';

test('login', async ({ page, isMobile }) => {
	await page.goto('/');
	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByPlaceholder('Your email address').fill('test@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('logout', async ({ page, isMobile }) => {
	await page.goto('/');
	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByPlaceholder('Your email address').fill('test@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await page.locator('#avatar-menu').click();
	await page.getByRole('button', { name: 'Sign out' }).click();

	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
});
