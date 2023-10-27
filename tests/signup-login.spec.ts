import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill('test@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();

	await expect(page.getByRole('button', { name: 'Logout' })).toContainText('LOGOUT');
});

test('logout', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill('test@mail.com');
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await page.getByRole('button', { name: 'LOGOUT' }).click();

	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
});
