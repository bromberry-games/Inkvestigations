import type { Page } from '@playwright/test';

export async function sendMessage(page: Page, message: string) {
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill(message);
	await page.locator('button[type="submit"]').nth(1).click();
}
