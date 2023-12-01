import type { Page } from '@playwright/test';
import { supabase_full_access } from './supabase_test_access';
import 'dotenv/config';

export async function loginOnPage(page: Page, isMobile: boolean, email: string, password: string) {
	await page.evaluate(() => document.fonts.ready);
	await page.goto('/', { waitUntil: 'load' });
	await navToLogin(page, isMobile);
	await fillOutLoginOrSignupForm(page, email, password);
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

export async function signUpAndConfirmUser(email: string, password: string) {
	const { error } = await supabase_full_access.auth.admin.createUser({
		email: email,
		password: password,
		email_confirm: true
	});
	if (error) {
		throw error;
	}
}

export async function navToLogin(page: Page, isMobile: boolean) {
	if (isMobile) {
		await page.waitForTimeout(200);
		await page.getByLabel('bars 3').click();
	}
	await page.getByRole('link', { name: 'Login' }).nth(0).click();
}

export async function fillOutLoginOrSignupForm(page: Page, email: string, password: string) {
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(200);
	await page.getByPlaceholder('Your email address').fill(email);
	await page.getByPlaceholder('Your email address').press('Tab');
	await page.getByPlaceholder('Your password').fill(password);
}

export function generateRandomUserMail() {
	return `${Math.floor(Math.random() * 1000000) + 1}@bromberry.xyz`;
}

export async function createNewUserAndLogin(page: Page, isMobile: boolean) {
	const email = generateRandomUserMail();
	const password = 'password-new-user';
	await signUpAndConfirmUser(email, password);
	await loginOnPage(page, isMobile, email, password);
	return { mail: email, password };
}

export async function createNeUserAndLoginViaUrl(page: Page, url: string) {
	const email = generateRandomUserMail();
	const password = 'password-new-user';
	await signUpAndConfirmUser(email, password);
	await page.goto(url + '/login');
	await fillOutLoginOrSignupForm(page, email, password);
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	return { mail: email, password };
}

export async function fillOutSingupFormConfirmMailLogin(page: Page, isMobile: boolean) {
	const email = generateRandomUserMail();
	await fillOutLoginOrSignupForm(page, email, 'password-new-user');
	await page.getByRole('checkbox').click();
	await page.getByRole('button', { name: 'Sign up' }).click();
	await page.waitForTimeout(100);
	if (isMobile || process.env.ENV_TO_TEST == 'DEV') {
		const users = (await supabase_full_access.auth.admin.listUsers()).data.users;
		const user = users.find((user) => {
			return user.email == email;
		});
		if (!user) {
			console.error('user not found');
			return;
		}
		await supabase_full_access.auth.admin.updateUserById(user?.id, { email_confirm: true });
		await page.getByRole('link', { name: 'Already have an account? Sign in' }).click();
		await fillOutLoginOrSignupForm(page, email, 'password-new-user');
		await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	} else {
		await page.goto('http://localhost:54329/');
		await page.getByRole('link', { name: 'Monitor' }).click();
		await page.getByRole('cell').nth(5).click();
		await page.getByRole('link', { name: 'Confirm your email address' }).click();
	}
}
