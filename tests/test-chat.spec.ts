import { test, expect } from '../playwright/fixtures';

test('test gpt connection and expect message counter to go down', async ({ page }) => {
	await page.goto('/mysteries');

	await page.waitForTimeout(100);
	await page.getByRole('button', { name: 'RESTART' }).first().click();
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('test');

	const messageCount = await page.getByTestId('message-counter').innerText();
	await page.locator('button[type="submit"]').click();

	const message = page.getByText('Police chief:').nth(1);
	await message.waitFor({ timeout: 45000 });
	await expect(page.getByText('Police chief:').nth(1)).toBeVisible();
	const newMessageCount = await page.getByTestId('message-counter').innerText();
	expect(parseInt(newMessageCount) + 1).toBe(parseInt(messageCount));
});

// test('test accuse works ', async ({ page }) => {
// await page.goto('/Mirror_Mirror', { waitUntil: 'load' });
// await page.waitForTimeout(100);
// await page.getByRole('button', { name: 'ACCUSE' }).click();
// await page.getByRole('img', { name: 'Oliver Smith' }).click();
//
// const amount = await page.getByText('Police chief:').count();
// await page
// .getByPlaceholder('Enter to send, Shift+Enter for newline')
// .fill('He did it with the poison pen. Put cyanide in the ink the day of the party. Was mad about the victims journalistic integrity.');
// await page.locator('button[type="submit"]').click();
//
// const message = page.getByText('Police chief:').nth(amount);
// await message.waitFor({ timeout: 45000 });
// await expect(page.getByText('Police chief:').nth(amount)).toBeVisible();
//
// await expect(page.getByPlaceholder('Enter to send, Shift+Enter for newline')).toBeDisabled();
// });
//
