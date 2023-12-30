import { STRIPE_TEST_KEY } from '$env/static/private';

import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { Session } from '@supabase/supabase-js';
import { loadActiveSubscriptions, loadActiveAndUncancelledSubscription, getStripeCustomer } from '$lib/supabase/prcing.server';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers.js';

const stripe = new Stripe(STRIPE_TEST_KEY, {
	apiVersion: '2022-11-15'
});

export const load = async ({ locals: { getSession } }) => {
	const [subscription, stripePrices, currentSubscription] = await Promise.all([
		loadActiveSubscriptions(),
		stripe.prices.list({
			active: true,
			expand: ['data.product']
			// recurring: {
			// interval: 'month'
			// }
		}),
		(async () => {
			const session = await getSession();
			if (getAuthStatus(session) == AuthStatus.LoggedIn) {
				const subData = await loadActiveAndUncancelledSubscription(session.user.id);
				if (!subData) {
					error(500, 'could not load sub');
				}
				return subData.id;
			} else {
				return null;
			}
		})()
	]);
	if (!subscription) {
		error(500, 'could not load subs');
	}
	const singlePrices = stripePrices.data.filter((price) => {
		return price.recurring == null;
	});

	const stripeSubscriptions = stripePrices.data
		.filter((price) => {
			return price.recurring?.interval === 'month';
		})
		.sort((a, b) => {
			return a.unit_amount - b.unit_amount;
		})
		.map((price) => {
			const subInfo = subscription.find((sub) => sub.stripe_price_id === price.id);
			return {
				id: price.id,
				currency: price.currency,
				unit_amount: price.unit_amount,
				product_name: subInfo?.name,
				daily_message_limit: subInfo?.daily_message_limit,
				currentPlan: currentSubscription === price.id
			};
		});

	return { stripeSubscriptions: stripeSubscriptions, hasSub: !!currentSubscription, oneTimeItems: singlePrices };
};

export const actions = {
	subscribe: async ({ url, request, locals: { getSession } }) => {
		const user_session: Session = await getSession();
		const form_data = request.formData();
		const price = (await form_data).get('price_id') as string;

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: price,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${url.origin}/success`,
			cancel_url: `${url.origin}/pricing`,
			automatic_tax: { enabled: true },
			metadata: {
				user_id: user_session.user.id
			},
			subscription_data: {
				metadata: {
					user_id: user_session ? user_session.user.id : ''
				}
			}
		});

		if (session.url) {
			redirect(303, session.url);
		}
		error(420, 'Enhance your calm');
	},
	buy: async ({ request, url, locals: { getSession } }) => {
		const user_session: Session = await getSession();
		if (getAuthStatus(user_session) != AuthStatus.LoggedIn) {
			redirect(303, '/login');
		}
		const [form_data, customerId] = await Promise.all([request.formData(), getStripeCustomer(user_session.user.id)]);
		const price = form_data.get('price_id') as string;
		isTAndThrowPostgresErrorIfNot(customerId);
		const stripeProperties = {
			line_items: [
				{
					price: price,
					quantity: 1
				}
			],
			success_url: `${url.origin}/success`,
			cancel_url: `${url.origin}/pricing`,
			automatic_tax: { enabled: true },
			metadata: {
				user_id: user_session.user.id
			}
		};
		let session;
		if (customerId != '') {
			session = await stripe.checkout.sessions.create({
				mode: 'payment',
				...stripeProperties,
				customer: customerId
			});
		} else {
			session = await stripe.checkout.sessions.create({
				mode: 'payment',
				...stripeProperties,
				customer_creation: 'always'
			});
		}

		if (session.url) {
			redirect(303, session.url);
		}
		error(420, 'Enhance your calm');
	},
	cancel: async ({ url, locals: { getSession } }) => {
		const session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			error(401, 'Not logged in');
		}
		const customerId = await getStripeCustomer(session.user.id);
		isTAndThrowPostgresErrorIfNot(customerId);
		const stripeSessions = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${url.origin}/pricing`
		});
		redirect(303, stripeSessions.url);
	}
};
