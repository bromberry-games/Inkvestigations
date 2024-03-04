import { test, expect, type Page } from '../playwright/fixtures';
import { sendMessage } from './chat-helpers';
// import { sendMessage } from './test-chat.spec';

async function setOwnToken(page: Page, val = true) {
	await page.goto('/user/edit', { waitUntil: 'networkidle' });
	const checkbox = await page.getByLabel('Use my own openai token');
	if ((await checkbox.isChecked()) == val) return;
	await checkbox.click();
	await page.getByRole('button', { name: 'Save' }).click();
	await page.waitForTimeout(300);
}

async function fillOutTokenForm(page: Page, token: string) {
	await page.getByPlaceholder('OpenAI token').fill(token);
	await page.getByRole('button', { name: 'I accept' }).click();
}

test('activate own token setting', async ({ page, account }) => {
	await setOwnToken(page);
	await page.waitForTimeout(200);

	await page.goto('/mysteries');
	await page.getByRole('link', { name: 'Mirror Mirror ☆ ☆ ☆' }).click();
	await expect(await page.getByRole('heading', { name: 'Use own openai token' })).toBeVisible();
});

test('insert token, modal should not pop up again', async ({ page, account }) => {
	await setOwnToken(page);
	await page.waitForTimeout(200);

	await page.goto('/mysteries');
	await page.getByRole('link', { name: 'Mirror Mirror ☆ ☆ ☆' }).click();
	await fillOutTokenForm(page, 'test');
	await page.reload();
	await expect(await page.getByRole('heading', { name: 'Use own openai token' })).not.toBeVisible();
});

test('activate own token setting, then deactivate it modal should not pop up', async ({ page, account }) => {
	await setOwnToken(page);
	await page.goto('/mysteries');
	await page.getByRole('link', { name: 'Mirror Mirror ☆ ☆ ☆' }).click();
	await expect(await page.getByRole('heading', { name: 'Use own openai token' })).toBeVisible();
	await setOwnToken(page, false);
	await page.goto('/mysteries');
	await page.getByRole('link', { name: 'Mirror Mirror ☆ ☆ ☆' }).click();


	await expect(await page.getByRole('heading', { name: 'Use own openai token' })).not.toBeVisible();
});

// test('insert invalid token, should error and show error modal', async ({ page, account }) => {
// await setOwnToken(page);
// await page.goto('/Mirror_Mirror');
// await fillOutTokenForm(page, 'test');
// await sendMessage(page, 'test');
// });
