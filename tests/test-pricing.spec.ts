// import { test, expect, type Page } from '../playwright/fixtures';

import { test, expect, type Page } from '@playwright/test';
import { createRandomUser, loginOnPage } from './login-helpers';
import { supabase_full_access } from './supabase_test_access';
import {
	navigateRestart,
	navigateRestartAndReturnMessageCounter,
	sendMessage,
	waitForCheckMessageAndReturnMessageCount
} from './chat-helpers';

async function fillOutCreditCardForm(page: Page) {
	await page.waitForTimeout(100);
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

test.beforeEach(async ({ page, isMobile, context }, testInfo) => {
	//dont want to deal with state for theses tests
	const account = await createRandomUser();
	await loginOnPage(page, isMobile, account.email, account.password);
	context.userId = account.userId;
	await expect(page.locator('#avatar-menu')).toBeVisible();
});

async function navigateToPricingAndBuyNthPlan(page: Page, nth: number) {
	await page.getByRole('link', { name: 'PRICING' }).click();
	await page.getByRole('button', { name: 'CHOOSE PLAN' }).nth(nth).click();
	await fillOutCreditCardForm(page);
}

async function navigateToPricing(page: Page, isMobile: boolean) {
	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'PRICING' }).click();
}

test('test buying, chaning plan and cacelling', async ({ page, isMobile }) => {
	await navigateToPricingAndBuyNthPlan(page, 1);
	await navigateToPricing(page, isMobile);

	await expect(page.getByRole('button', { name: 'CANCEL PLAN' })).toBeVisible();

	await page.getByRole('button', { name: 'CANCEL PLAN' }).nth(0).click();
	await page.locator('[data-test="cancel-subscription"]').click();
	await page.getByTestId('confirm').click();
	await page.getByTestId('cancellation_reason_cancel').click();
	await page.getByRole('link', { name: 'Hackler Simon Claudius, Živanović Ivan GbR Test mode' }).click();
});

test('Buy first plan, then upgrade', async ({ page, isMobile }) => {
	test.setTimeout(60000);
	await navigateToPricingAndBuyNthPlan(page, 0);
	await navigateToPricing(page, isMobile);

	await expect(page.getByRole('button', { name: 'CANCEL PLAN' })).toBeVisible();
	await page.getByRole('button', { name: 'UPGRADE PLAN' }).click();
	await page.getByTestId('hosted-payment-submit-button').click();
	await navigateToPricing(page, isMobile);
	await page.getByRole('button', { name: 'CANCEL PLAN' }).nth(0).click();
	await expect(page.locator('[data-test="cancel-subscription"]').nth(0)).toBeVisible();
	await expect(page.locator('[data-test="cancel-subscription"]').nth(1)).not.toBeVisible();
});

async function buyNthPlanAndTestMeteredMessages(page: Page, isMobile: boolean, nth: number, userId: string) {
	await navigateToPricingAndBuyNthPlan(page, nth);
	await supabase_full_access.from('user_messages').update({ amount: 0, non_refillable_amount: 0 }).eq('user_id', userId);
	if (isMobile) {
		await page.getByRole('button', { name: 'bars 3' }).click();
	}
	await page.getByRole('link', { name: 'MYSTERIES' }).click();
	const messageCounter = await navigateRestartAndReturnMessageCounter(page);
	expect(messageCounter).toBe(0);
	await page.waitForTimeout(1000);
	await sendMessage(page, 'test usage');
	const newMessageCount = await waitForCheckMessageAndReturnMessageCount(page, 'Police chief:', 1);
	//TODO This will fail once message bundles are adjusted. Should be fixed
	expect(newMessageCount).toBe(19);
}

test('Buy first plan, then send message to test usage', async ({ page, isMobile, context }) => {
	await buyNthPlanAndTestMeteredMessages(page, isMobile, 0, context.userId);
});

test('Buy second plan, then send message to test usage', async ({ page, isMobile, context }) => {
	await buyNthPlanAndTestMeteredMessages(page, isMobile, 1, context.userId);
});

test('buy messages', async ({ page, isMobile }) => {
	await page.goto('/pricing');
	await page.getByRole('button', { name: 'Buy now' }).click();

	await fillOutCreditCardForm(page);
});
