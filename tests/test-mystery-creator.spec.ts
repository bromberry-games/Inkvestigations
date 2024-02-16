import { test, expect } from '../playwright/fixtures';
import path from 'path';
import fs from 'fs';

test('test create new mystery and save it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.getByPlaceholder('Mirror Mirror').click();
	await page.getByPlaceholder('Mirror Mirror').fill('test mystery');
	await page.getByRole('button', { name: 'save' }).click();
	await page.waitForLoadState('networkidle');

	await expect(page.getByPlaceholder('Mirror Mirror')).toHaveValue('test mystery');
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'Delete' }).click();
});

test('test create new mystery and save it then change name', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.getByPlaceholder('Mirror Mirror').click();
	await page.getByPlaceholder('Mirror Mirror').fill('new mystery');
	await page.getByRole('button', { name: 'save' }).click();
	await page.waitForLoadState('networkidle');
	await page.getByPlaceholder('Mirror Mirror').fill('even newer mystery');
	await page.getByRole('button', { name: 'save' }).click();

	await page.waitForURL('**/user/mysteries/even_newer_mystery');

	await expect(page.getByPlaceholder('Mirror Mirror')).toHaveValue('even newer mystery');
	await expect(page.url()).toContain('/user/mysteries/even_newer_mystery');

	await page.goto('/user/mysteries');
	await expect((await page.getByLabel('mystery').nth(0).allInnerTexts())[0]).toContain('even newer mystery');
});

test('test create new mystery and publish it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.locator('input[name="mystery.name"]').fill('Test mystery name');
	await page.locator('input[name="mystery.setting"]').fill('England in the 1890s, a small town called Romey');
	await page.locator('input[name="mystery.description"]').fill('test description');
	await page.locator('input[name="mystery.theme"]').fill('Mystery Theme');
	await page.locator('input[name="mystery.victim_name"]').fill('John Toilard');
	await page
		.locator('input[name="mystery.letter_info"]')
		.fill('Hello Sherlock. I made this mystery myself! It is what I believe they call a custom user created one!');
	await page
		.locator('input[name="mystery.victim_description"]')
		.fill('kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.');
	await page.locator('input[name="mystery.solution"]').fill('Solve the mystery');

	await page.locator('input[name="suspects[0].name"]').fill('Butler Jesob');
	await page.locator('input[name="suspects[0].description"]').fill('A long-time butler and good friend of the family, loves the children.');

	await page.locator('input[name="timeframes[0].timeframe"]').fill('The time frame');
	await page.locator('input[name="timeframes[0].event_happened"]').fill('What happened');

	await page.locator('input[name="action_clues[0].action"]').fill('Inspect the garden');
	await page.locator('input[name="action_clues[0].clue"]').fill('Found a hidden key');

	await page.getByRole('button', { name: 'Submit' }).click();
});
