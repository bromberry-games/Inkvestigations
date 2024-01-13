import { expect, type Page } from '@playwright/test';

export async function sendMessage(page: Page, message: string) {
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill(message);
	await page.locator('button[type="submit"]').nth(1).click();
}

export async function navigateRestart(page: Page): Promise<void> {
	await page.goto('/mysteries', { waitUntil: 'networkidle' });
	const navigationPromise = page.waitForURL('/Mirror_Mirror', { waitUntil: 'networkidle' });
	await page.getByRole('link', { name: 'Mirror Mirror ☆ ☆ ☆' }).click();
	await page.getByRole('button', { name: 'rotate outline RESET CHAT' }).click();
	await navigationPromise;
}

export async function navigateRestartAndReturnMessageCounter(page: Page): Promise<number> {
	await navigateRestart(page);
	return parseInt(await page.getByTestId('message-counter').innerText());
}

export async function waitForCheckMessageAndReturnMessageCount(page: Page, text: string, nth = 1): Promise<number> {
	const message = page.getByText(text).nth(nth);
	await message.waitFor({ timeout: 45000 });
	await expect(page.getByText(text).nth(nth)).toBeVisible();
	return parseInt(await page.getByTestId('message-counter').innerText());
}
