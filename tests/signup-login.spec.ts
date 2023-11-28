import { test, expect, type Page } from '@playwright/test';
import {
	createNewUserAndLogin,
	fillOutLoginOrSignupForm,
	fillOutSingupFormConfirmMailLogin,
	generateRandomUserMail,
	loginOnPage,
	navToLogin
} from './helpers';
import { goto } from '$app/navigation';

async function logoutOfPage(page: Page, isMobile: boolean) {
	await page.locator('#avatar-menu').click();
	await page.getByRole('button', { name: 'Sign out' }).click();

	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
}

test('login', async ({ page, isMobile }) => {
	await createNewUserAndLogin(page, isMobile);

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('logout', async ({ page, isMobile }) => {
	await createNewUserAndLogin(page, isMobile);
	await logoutOfPage(page, isMobile);

	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
});

test('login logout and login should redirect', async ({ page, isMobile }) => {
	const { mail, password } = await createNewUserAndLogin(page, isMobile);
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

test('signup without aggreeing to terms should display error', async ({ page, isMobile }) => {
	await page.goto('/login');
	await page.waitForTimeout(200);
	await page.getByRole('link', { name: 'Create new Account' }).click();
	const email = generateRandomUserMail();
	await fillOutLoginOrSignupForm(page, email, 'password-new-user');
	await page.getByRole('button', { name: 'Sign up' }).click();

	await expect(page.getByText('You must agree to the terms and conditions and privacy policy to use the service.')).toBeVisible();
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

test('delete user cant log back in', async ({ page, isMobile }) => {
	const { mail, password } = await createNewUserAndLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.goto('/user/edit');

	await page.getByRole('button', { name: 'Delete my account' }).click();
	await page.getByRole('button', { name: 'Delete my account and all account data' }).click();

	await expect(new URL(page.url()).pathname).toBe('/confirmations/account-deleted');
	await page.goto('/login');
	await loginOnPage(page, isMobile, mail, password);
	await expect(page.getByText('Invalid login credentials')).toBeVisible();
});
