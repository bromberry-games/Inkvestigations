import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
    "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret
  });

  await page.goto('/');
  expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  
  //await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  await page.context().storageState({ path: authFile });
});