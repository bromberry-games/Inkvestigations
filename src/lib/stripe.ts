import { STRIPE_TEST_KEY } from '$env/static/private';
import Stripe from 'stripe';

export const stripeClient = new Stripe(STRIPE_TEST_KEY, {
	apiVersion: '2022-11-15'
});
