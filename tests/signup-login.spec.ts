import { test, expect, type Page } from '@playwright/test';
import { fillOutSingupFormConfirmMailLogin, generateRandomUserMail, loginOnPage, navToLogin, signUpAndConfirmUser } from './helpers';

async function logoutOfPage(page: Page, isMobile: boolean) {
	await page.locator('#avatar-menu').click();
	await page.getByRole('button', { name: 'Sign out' }).click();

	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
}

test('login', async ({ page, isMobile }) => {
	const mail = generateRandomUserMail();
	const password = 'password-test-user';
	await signUpAndConfirmUser(mail, password);
	await loginOnPage(page, isMobile, mail, password);

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('logout', async ({ page, isMobile }) => {
	const mail = generateRandomUserMail();
	const password = 'password-test-user';
	await signUpAndConfirmUser(mail, password);
	await loginOnPage(page, isMobile, mail, password);
	await logoutOfPage(page, isMobile);

	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
});

test('login logout and login should redirect', async ({ page, isMobile }) => {
	const mail = generateRandomUserMail();
	const password = 'password-test-user';
	await signUpAndConfirmUser(mail, password);
	await loginOnPage(page, isMobile, mail, password);
	await logoutOfPage(page, isMobile);
	await loginOnPage(page, isMobile, mail, password);
	await page.waitForURL('/mysteries');

	await expect(new URL(page.url()).pathname).toBe('/mysteries');
});

test('signup user and confirm email', async ({ page, isMobile }) => {
	await page.goto('/login');
	await page.waitForTimeout(200);
	await page.getByRole('link', { name: 'Create new Account' }).click();
	await page.waitForTimeout(200);
	await fillOutSingupFormConfirmMailLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('test try for free', async ({ page, isMobile }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'TRY FOR FREE' }).click();
	await page.waitForTimeout(3000);
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('test');
	await page.locator('button[type="submit"]').click();
	const message = page.getByText('Police chief:').nth(1);
	await message.waitFor({ timeout: 45000 });
	await navToLogin(page, isMobile);
	await page.waitForTimeout(200);
	await fillOutSingupFormConfirmMailLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.getByRole('link', { name: 'PLAY' }).click();
	await expect(page.getByText('Police chief:').nth(1)).toBeVisible();
});
