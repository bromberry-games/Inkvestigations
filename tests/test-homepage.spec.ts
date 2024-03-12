import { test, expect } from '../playwright/fixtures';

test('test', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Start playing Forced Farewell' }).click();
	await expect(page.getByTestId('chat-input')).toBeVisible();
});
