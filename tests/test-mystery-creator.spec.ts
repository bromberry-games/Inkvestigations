import { test, expect } from '../playwright/fixtures';
import path from 'path';
import fs from 'fs';

test('test create new mystery and save it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('link', { name: 'New' }).click();
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
	await page.getByRole('link', { name: 'New' }).click();
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

test.afterAll(async () => {
	const id = test.info().parallelIndex;
	const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
	fs.unlink(fileName, (err) => {
		if (err) {
			console.error(err);
		}
	});
});
