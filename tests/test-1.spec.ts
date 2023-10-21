import { test, expect } from '@playwright/test';
//import {createServer} from './mock-server';
//
//let server = createServer();
//
//test.beforeAll(async () => {
//  server = createServer();
//  server.start(3000);
//  console.log("server starting");
//  console.log(server)
//});
//
//test.afterAll(async () => {
//  server.stop();
//});
//
//test('test', async ({ page }) => {
//  await page.goto('/');
//
//  await page.getByRole('link', { name: 'Mysteries' }).click();
//  await page.getByRole('link', { name: 'Play' }).nth(2).click();
//  await page.getByRole('button', { name: 'Accuse' }).click();
//  await page.locator('label').filter({ hasText: 'Oliver Smith' }).getByRole('img').click();
//  await page.getByRole('dialog').getByRole('button', { name: 'Accuse' }).click();
//});
//
//test('mystery chat', async ({ page }) => {
//  //TODO Get this to work somehow
//  await page.goto('/');
//
//  await page.getByRole('link', { name: 'Mysteries' }).click();
//  await page.getByRole('link', { name: 'Play' }).nth(0).click();
//  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').click();
//  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('whaddup wellington');
//
//  await page.route('*/**/api/ask', async route => {
//        await route.continue({ url: 'http://localhost:3000/ask' });
//        //This does not work on chrome https://github.com/microsoft/playwright/issues/23598 
//  });
//  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').press('Enter');
//  await page.pause();
//  await new Promise(resolve => setTimeout(resolve, 3000));
//
//});