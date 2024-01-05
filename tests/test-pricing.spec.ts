// import { test, expect, type Page } from '../playwright/fixtures';

import { test, expect, type Page } from '@playwright/test';
import { createRandomUser, loginOnPage } from './login-helpers';

async function fillOutCreditCardForm(page: Page) {
	await page.getByLabel('Email').click();
	await page.getByLabel('Email').fill('coolmail@mail.com');
	await page.getByLabel('Email').press('Tab');
	await page.getByTestId('card-tab-button').press('Tab');
	await page.getByPlaceholder('1234 1234 1234 1234').fill('4242 4242 4242 4242');
	await page.getByPlaceholder('1234 1234 1234 1234').press('Tab');
	await page.getByPlaceholder('MM / YY').fill('04 / 28');
	await page.getByPlaceholder('MM / YY').press('Tab');
	await page.getByPlaceholder('CVC').fill('111');
	await page.getByPlaceholder('CVC').press('Tab');
	await page.getByPlaceholder('Full name on card').fill('coolio');
	await page.getByTestId('hosted-payment-submit-button').click();
}

test.beforeEach(async ({ page, isMobile }) => {
	//dont want to deal with state for theses tests
	const account = await createRandomUser();
	await loginOnPage(page, isMobile, account.email, account.password);
	await expect(page.locator('#avatar-menu')).toBeVisible();
});

test('test buying, chaning plan and cacelling', async ({ page, isMobile }) => {
	await page.goto('/pricing');
	await page.getByRole('button', { name: 'CHOOSE PLAN' }).nth(1).click();

	await fillOutCreditCardForm(page);

	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'PRICING' }).click();
	await expect(page.getByRole('button', { name: 'CANCEL PLAN' })).toBeVisible();

	await page.getByRole('button', { name: 'CHANGE PLAN' }).nth(0).click();
	await page.locator('[data-test="update-subscription"]').click();
	await page.getByTestId('pricing-table').locator('div').filter({ hasText: 'Rookie€4.99 per monthSelect' }).getByRole('button').click();
	await page.getByTestId('continue-button').click();
	await page.getByTestId('confirm').click();
	await page.waitForTimeout(3000);
	await page.getByTestId('return-to-business-link').click();
	await expect(
		page
			.locator('div')
			.filter({ hasText: /^Rookie \$ 4\.99 per month 10 Messages per day CANCEL PLAN$/ })
			.getByRole('button')
	).toBeVisible();
});

test('buy messages', async ({ page, isMobile }) => {
	await page.goto('/pricing');
	await page.getByRole('button', { name: 'Buy now' }).click();

	await fillOutCreditCardForm(page);
});
