import { test, expect, type Page } from '@playwright/test';
import {
	createNewUserAndLogin,
	fillOutLoginOrSignupForm,
	fillOutSingupFormConfirmMailLogin,
	generateRandomUserMail,
	loginOnPage,
	navToLogin
} from './login-helpers';
import { supabase_full_access } from './supabase_test_access';
import { aw } from 'vitest/dist/reporters-OH1c16Kq.js';
import { sendMessage } from './chat-helpers';

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

test('login, logout, reset password and login', async ({ page, isMobile }) => {
	const { mail } = await createNewUserAndLogin(page, isMobile);
	await logoutOfPage(page, isMobile);
	await expect(page.getByRole('link', { name: 'LOGIN', exact: true })).toBeVisible();
	await navToLogin(page, isMobile);
	await page.getByRole('link', { name: 'Forgot your password?' }).click();
	await page.getByPlaceholder('Your email address').fill(mail);
	await page.getByRole('button', { name: 'Send reset password' }).click();
	await page.goto('http://127.0.0.1:54329/monitor');
	await page.getByRole('cell', { name: '<admin@email.com>' }).first().click();
	await page.getByRole('link', { name: 'Reset password' }).click();

	await page.waitForLoadState('networkidle');
	const newPassword = 'the-cool-password';
	await page.getByPlaceholder('New password').fill(newPassword);
	await page.getByRole('button', { name: 'Update password' }).click();
	await logoutOfPage(page, isMobile);
	await loginOnPage(page, isMobile, mail, newPassword);

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('login, update password, logout and login again', async ({ page, isMobile }) => {
	const { mail } = await createNewUserAndLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.goto('/update-password', { waitUntil: 'networkidle' });
	const newPassword = 'the-cool-password';
	await page.getByPlaceholder('New password').fill(newPassword);
	await page.getByRole('button', { name: 'Update password' }).click();
	await logoutOfPage(page, isMobile);
	await loginOnPage(page, isMobile, mail, newPassword);

	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('login logout and login should redirect', async ({ page, isMobile }) => {
	const { mail, password } = await createNewUserAndLogin(page, isMobile);
	await logoutOfPage(page, isMobile);
	await loginOnPage(page, isMobile, mail, password);
	await page.waitForURL('/mysteries');

	await expect(new URL(page.url()).pathname).toBe('/mysteries');
});

test('signup user and confirm email', async ({ page, isMobile }) => {
	await page.goto('/login', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Create new Account' }).click();
	await page.waitForTimeout(200);
	await fillOutSingupFormConfirmMailLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('signup without aggreeing to terms should display error', async ({ page, isMobile }) => {
	await page.goto('/login', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Create new Account' }).click();
	const email = generateRandomUserMail();
	await fillOutLoginOrSignupForm(page, email, 'password-new-user');
	await page.getByRole('button', { name: 'Sign up' }).click();

	await expect(page.getByText('You must agree to the terms and conditions and privacy policy to use the service.')).toBeVisible();
});

test('test try for free', async ({ page, isMobile }) => {
	await supabase_full_access.from('for_free_users').update({ amount: 1 }).eq('id', 1);

	await page.goto('/');
	await page.getByRole('button', { name: 'TRY FOR FREE' }).click();
	await page.waitForTimeout(3000);
	//Cancels the animation
	await page.getByRole('button', { name: 'rotate outline RESET CHAT' }).click();

	await sendMessage(page, 'test');
	const message = page.getByText('Police chief:').nth(1);
	await message.waitFor({ timeout: 45000 });
	await page.waitForLoadState('networkidle');
	await navToLogin(page, isMobile);
	await page.waitForTimeout(200);
	await fillOutSingupFormConfirmMailLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();

	await page.getByRole('link', { name: 'Forced Farewell ☆ ☆ ☆' }).click();
	await expect(page.getByText('Police chief:').nth(1)).toBeVisible();
});

test('test try for free when limit is full should redirect', async ({ page, isMobile }) => {
	await supabase_full_access.from('for_free_users').update({ amount: 0 }).eq('id', 1);

	await page.goto('http://localhost:5173/');
	await page.getByRole('button', { name: 'TRY FOR FREE' }).click();

	await page.waitForURL('/confirmations/for-free-users-exhausted');
	await expect(new URL(page.url()).pathname).toBe('/confirmations/for-free-users-exhausted');
});

test('delete user cant log back in', async ({ page, isMobile }) => {
	const { mail, password } = await createNewUserAndLogin(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.goto('/user/edit', { waitUntil: 'networkidle' });

	// await page.waitForTimeout(200);
	await page.getByRole('button', { name: 'Delete my account' }).click();
	await page.getByRole('button', { name: 'Delete my account and all account data' }).click();

	await expect(new URL(page.url()).pathname).toBe('/confirmations/account-deleted');
	await page.goto('/login');
	await loginOnPage(page, isMobile, mail, password);
	await expect(page.getByText('Invalid login credentials')).toBeVisible();
});
