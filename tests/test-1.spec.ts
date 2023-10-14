import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Mysteries' }).click();
  await page.getByRole('link', { name: 'Play' }).nth(2).click();
  await page.getByRole('button', { name: 'Accuse' }).click();
  await page.locator('label').filter({ hasText: 'Oliver Smith' }).getByRole('img').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Accuse' }).click();
});

test('mystery chat', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Mysteries' }).click();
  await page.getByRole('link', { name: 'Play' }).nth(2).click();
  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').click();
  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').fill('whaddup wellington');
 // const requests = [
 //   {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]},
 //   {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]},
 //   {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}
 // ]
 // for (const request of requests) {
 //   await page.route('*/**/api/ask', async route => {
 //       await route.fulfill({
 //         body: JSON.stringify(request),
 //         status: 200,
 //         contentType: 'text/event-stream',
 //       });
 //   });
 // }

  const rawObject = {
  "0": 100,
  "1": 97,
  "2": 116,
  "3": 97,
};

const parsedArray = Object.values(rawObject); 
const myBuffer: Buffer = Buffer.from(new Uint8Array(parsedArray));

// playwright route interception
await page.route(/.*\/api\/ask/, async (route) => {
  await route.fulfill({
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({content: 'hello'}),
  });
});
  await page.getByPlaceholder('Enter to send, Shift+Enter for newline').press('Enter');
  await new Promise(resolve => setTimeout(resolve, 3000));

});