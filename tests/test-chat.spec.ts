import { test, expect, type Page } from '../playwright/fixtures';
import {
	navigateRestart,
	navigateRestartAndReturnMessageCounter,
	sendMessage,
	waitForCheckMessageAndReturnMessageCount
} from './chat-helpers';
import { deleteLastBrainMessage, deleteLastMessageForUser, supabase_full_access } from './supabase_test_access';

test.beforeEach(async ({ page, account }) => {
	const { error } = await supabase_full_access.from('user_messages').update({ amount: 5 }).eq('user_id', account.userId);
	if (error) throw error;
});

test('test gpt connection and expect message counter to go down', async ({ page }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'test');

	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	await expect(page.getByText('Police chief:').nth(2)).not.toBeVisible();
	expect(newMessageCount + 1).toBe(messageCount);
});

test('No messages should not be able to write', async ({ page, account }) => {
	const { error } = await supabase_full_access
		.from('user_messages')
		.update({ amount: 0, non_refillable_amount: 0 })
		.eq('user_id', account.userId);
	if (error) throw error;
	await navigateRestart(page);
	await expect(page.getByText('No more messages left New')).toBeVisible();
});

test('should use up both messages', async ({ page, account }) => {
	const { error } = await supabase_full_access
		.from('user_messages')
		.update({ amount: 1, non_refillable_amount: 1 })
		.eq('user_id', account.userId);
	if (error) throw error;

	const messageCount = await navigateRestartAndReturnMessageCounter(page);
	expect(messageCount).toBe(2);
	await sendMessage(page, 'interrogate dexter tin');
	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);
	//This is now also 1 since now the bought messages are being used up. This might change in the future
	expect(newMessageCount).toBe(1);
	await sendMessage(page, 'do some cool stuff');
	const message = page.getByText('Police chief:').nth(2);
	await message.waitFor({ timeout: 45000 });
	await expect(page.getByText('No more messages left New')).toBeVisible();
});

test('delete message and then regenerate', async ({ page, account }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);

	await sendMessage(page, 'interrogate dexter tin');
	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);

	await deleteLastMessageForUser(account.userId);
	await page.reload({ waitUntil: 'load' });

	await page.getByRole('button', { name: 'REGENERATE' }).first().click();

	await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);
	await expect(page.getByTestId('chat-input')).toBeVisible();
	expect(newMessageCount + 1).toBe(messageCount);
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
	await expect(page.getByTestId('chat-input')).toBeVisible();
	expect(newMessageCount + 1).toBe(messageCount);
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

test('test accuse works ', async ({ page }) => {
	const messageCount = await navigateRestartAndReturnMessageCounter(page);
	await page.getByRole('button', { name: 'WRITE' }).click();

	const amount = await page.getByText('Police chief:').count();
	await sendMessage(
		page,
		'Oliver Smith did it with the poison pen. Put cyanide in the ink the day of the party. Was mad about the victims lack of journalistic ethics'
	);

	const message = page.getByText('Police chief:').nth(amount);
	await message.waitFor({ timeout: 45000 });

	await expect(page.getByText('Police chief:').nth(amount)).toBeVisible();
	await expect(page.getByPlaceholder('Game Over')).toBeDisabled();
});

test('notes should be saved', async ({ page, account }) => {
	await navigateRestart(page);
	await page.getByRole('button', { name: 'address card solid' }).click();
	await page.locator('textarea').first().fill('test');
	await page.locator('textarea').nth(3).fill('test number 2');
	await page.getByLabel('Close modal').click();
	await page.reload({ waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'address card solid' }).click();
	await expect(page.locator('textarea').first()).toHaveValue('test');
	await expect(page.locator('textarea').nth(3)).toHaveValue('test number 2');
});
