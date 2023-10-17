import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Your email address').fill('test@mail.com');
  await page.getByPlaceholder('Your email address').press('Tab');
  await page.getByPlaceholder('Your password').fill('password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page.getByRole('button', { name: 'Logout' })).toContainText('Logout');

  await page.context().storageState({ path: authFile });
});