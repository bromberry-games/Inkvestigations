import { test as setup, expect } from '@playwright/test';
import { loginOnPage } from './helpers';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, isMobile }) => {
	await loginOnPage(page, isMobile);
	await expect(page.locator('#avatar-menu')).toBeVisible();
	await page.context().storageState({ path: authFile });
});
