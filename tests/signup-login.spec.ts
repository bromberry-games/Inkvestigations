import { test, expect, type Page } from '@playwright/test';
import { fillOutLoginOrSignupForm, loginOnPage, navToLogin } from './helpers';
import { supabase_full_access } from './supabase_test_access';

function generateRandomUserMail() {
	return `${Math.floor(Math.random() * 1000000) + 1}@bromberry.xyz`;
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

test('signup user and confirm email', async ({ page, isMobile }) => {
	await page.goto('/login');
	await page.waitForTimeout(200);
	await page.getByRole('link', { name: 'Create new Account' }).click();
	await page.waitForTimeout(200);
	await fillOutSingupFormAndConfirmMail(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
});

async function fillOutSingupFormAndConfirmMail(page: Page, isMobile: boolean) {
	const email = generateRandomUserMail();
	await fillOutLoginOrSignupForm(page, isMobile, email, 'password-new-user');
	await page.getByRole('button', { name: 'Sign up' }).click();
	await page.waitForTimeout(1000);
	if (true) {
		const users = (await supabase_full_access.auth.admin.listUsers()).data.users;
		const user = users.find((user) => {
			return user.email == email;
		});
		if (!user) {
			console.error('user not found');
			return;
		}
		console.log('user found');
		console.log(user);
		await supabase_full_access.auth.admin.updateUserById(user?.id, { email_confirm: true });
		const { data, error } = await supabase_full_access.auth.admin.generateLink({
			type: 'magiclink',
			email: email,
			options: {
				redirectTo: 'http://localhost:5173/auth/callback'
			}
		});
		console.log(data.properties?.redirect_to);
		console.log(data.properties?.action_link);
		await page.goto(data.properties?.action_link);
		await page.waitForTimeout(1000);

		//await supabase_full_access.auth.admin.updateUserById(user?.id, { email_confirm: true });
		await page.getByRole('link', { name: 'Already have an account? Sign in' }).click();
		await fillOutLoginOrSignupForm(page, isMobile, email, 'password-new-user');
		await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	} else {
		await page.goto('http://localhost:54329/');
		await page.getByRole('link', { name: 'Monitor' }).click();
		await page.getByRole('cell').nth(4).click();
		await page.getByRole('link', { name: 'Confirm your email address' }).click();
	}
}

test('test try for free', async ({ page, isMobile }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'TRY FOR FREE' }).click();
	await page.waitForTimeout(3000);
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('test');
	await page.locator('button[type="submit"]').click();
	const message = page.getByText('Police chief:').nth(1);
	await message.waitFor({ timeout: 25000 });
	await navToLogin(page, isMobile);
	await page.waitForTimeout(200);
	await fillOutSingupFormAndConfirmMail(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.getByRole('link', { name: 'PLAY' }).click();
	await expect(page.getByText('Police chief:').nth(1)).toBeVisible();
});
