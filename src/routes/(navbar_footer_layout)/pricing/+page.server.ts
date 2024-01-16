import { STRIPE_TEST_KEY } from '$env/static/private';

import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { Session } from '@supabase/supabase-js';
import { loadActiveAndUncancelledSubscription, getStripeCustomer } from '$lib/supabase/prcing.server';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers.js';
import { SubscriptionBundles } from './bundles';
import { stripeClient } from '$lib/stripe';

const stripe = stripeClient;

export const load = async ({ locals: { getSession } }) => {
	const [stripePrices, currentSubscription] = await Promise.all([
		stripe.prices.list({
			active: true,
			expand: ['data.product']
		}),
		(async () => {
			const session = await getSession();
			if (getAuthStatus(session) == AuthStatus.LoggedIn) {
				const subData = await loadActiveAndUncancelledSubscription(session.user.id);
				isTAndThrowPostgresErrorIfNot(subData);
				return subData;
			} else {
				return [];
			}
		})()
	]);
	const singlePrices = stripePrices.data.filter((price) => {
		return price.recurring == null;
	});

	let subType;
	if (currentSubscription.length == 0) {
		subType = SubscriptionBundles.Free;
	} else if (currentSubscription[0].products.length == 1) {
		subType = SubscriptionBundles.ZeroDollar;
	} else if (currentSubscription[0].products.length == 2) {
		subType = SubscriptionBundles.NineDollar;
	}

	return { oneTimeItems: singlePrices, subType };
};

export const actions = {
	subscribe: async ({ url, request, locals: { getSession } }) => {
		const user_session: Session = await getSession();
		if (getAuthStatus(user_session) != AuthStatus.LoggedIn) {
			redirect(303, '/login');
		}
		const [form_data, customerId] = await Promise.all([request.formData(), getStripeCustomer(user_session.user.id)]);
		isTAndThrowPostgresErrorIfNot(customerId);
		let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		if (form_data.get('paymode') == SubscriptionBundles.ZeroDollar) {
			line_items = [
				{
					price: 'price_1OX3PyKIDbJkcynJ84FAWIsv'
				}
			];
		} else if (form_data.get('paymode') == SubscriptionBundles.NineDollar) {
			line_items = [
				{
					price: 'price_1Ng9UfKIDbJkcynJYsE9jPMZ',
					quantity: 1
				},
				{
					price: 'price_1OX1RjKIDbJkcynJBNwlgnJ2'
				}
			];
		}
		let session;
		const stripeProperties = {
			line_items,
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
		};
		if (customerId) {
			session = await stripe.checkout.sessions.create({
				mode: 'subscription',
				...stripeProperties,
				customer: customerId
			});
		} else {
			session = await stripe.checkout.sessions.create({
				mode: 'subscription',
				...stripeProperties
			});
		}

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
		if (customerId == '') {
			redirect(303, '/pricing');
		}
		const stripeSessions = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${url.origin}/pricing`
		});
		redirect(303, stripeSessions.url);
	}
};
