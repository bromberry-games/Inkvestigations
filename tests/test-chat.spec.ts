import { test, expect, type Page } from '../playwright/fixtures';
import { deleteLastBrainMessage, deleteLastMessageForUser, supabase_full_access } from './supabase_test_access';

async function navigateRestartAndReturnMessageCounter(page: Page): Promise<number> {
	await page.goto('/mysteries');
	await page.waitForTimeout(100);
	await page.getByRole('button', { name: 'RESTART' }).first().click();
	return parseInt(await page.getByTestId('message-counter').innerText());
}

async function sendMessage(page: Page, message: string) {
	await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill(message);
	await page.locator('button[type="submit"]').click();
}

async function waitForCheckMessageAndReturnMessageCount(page: Page, text: string, nth = 1): Promise<number> {
	const message = page.getByText(text).nth(nth);
	await message.waitFor({ timeout: 45000 });
	await expect(page.getByText(text).nth(nth)).toBeVisible();
	return parseInt(await page.getByTestId('message-counter').innerText());
}

test.beforeEach(async ({ page, account }) => {
	const { error } = await supabase_full_access.from('user_messages').update({ amount: 5 }).eq('user_id', account.userId);
	if (error) throw error;
});

test('test gpt connection and expect message counter to go down', async ({ page }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'test');

	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	expect(newMessageCount + 1).toBe(messageCount);
});

test('delete message and then regenerate', async ({ page, account }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'interrogate dexter tin');
	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	await deleteLastMessageForUser(account.userId);
	await page.reload({ waitUntil: 'load' });

	await page.getByRole('button', { name: 'REGENERATE' }).first().click();

	await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);
	await expect(page.getByPlaceholder('Enter to send, Shift+Enter for newline')).toBeVisible();
	await expect(newMessageCount + 1).toBe(messageCount);
});

test('delete message and brain message and then regenerate', async ({ page, account }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'interrogate dexter tin');
	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	await deleteLastMessageForUser(account.userId);
	await deleteLastBrainMessage(account.userId);
	await page.reload({ waitUntil: 'load' });

	await page.getByRole('button', { name: 'REGENERATE' }).first().click();

	await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);
	await expect(page.getByPlaceholder('Enter to send, Shift+Enter for newline')).toBeVisible();
	await expect(newMessageCount + 1).toBe(messageCount);
});

test('delete message, message and brain message and then regenerate. Message count should go down 2 times', async ({ page, account }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'interrogate dexter tin');
	await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	await deleteLastMessageForUser(account.userId);
	await deleteLastBrainMessage(account.userId);
	await page.reload({ waitUntil: 'load' });

	await deleteLastMessageForUser(account.userId);
	await page.getByRole('button', { name: 'REGENERATE' }).first().click();

	const messageCount2 = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	expect(messageCount2 + 2).toBe(messageCount);
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
