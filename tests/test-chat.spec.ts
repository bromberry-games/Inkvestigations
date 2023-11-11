import { test, expect } from '../playwright/fixtures';

test('test gpt connection and expect message counter to go down', async ({ page }) => {
	await page.goto('/mysteries');

	await page.waitForTimeout(100);
	await page.getByRole('button', { name: 'RESTART' }).first().click();
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('test');

	const messageCount = await page.getByTestId('message-counter').innerText();
	await page.locator('button[type="submit"]').click();

	const message = page.getByText('Police chief:').nth(1);
	await message.waitFor({ timeout: 30000 });
	await expect(page.getByText('Police chief:').nth(1)).toBeVisible();
	const newMessageCount = await page.getByTestId('message-counter').innerText();
	expect(parseInt(newMessageCount) + 1).toBe(parseInt(messageCount));
});
