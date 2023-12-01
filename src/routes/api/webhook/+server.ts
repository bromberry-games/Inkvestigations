import Stripe from 'stripe';
import { STRIPE_TEST_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { cancelSubscription, createSubscription, updateSubscription } from '$lib/supabase/subscription.server';
import { checkIfEventExists, insertEvent, linkCustomerToUser } from '$lib/supabase/prcing.server';
import { throwIfFalse } from '$misc/error.js';

const stripe = new Stripe(STRIPE_TEST_KEY, {
	apiVersion: '2022-11-15'
});

export async function POST({ request }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	console.log('webhook hit');
	let event;
	try {
		event = await stripe.webhooks.constructEventAsync(body, signature as string, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.warn('⚠️  Webhook signature verification failed.', err.message);

		return new Response(undefined, { status: 400 });
	}
	const eventExists = await checkIfEventExists(event.id);
	if (eventExists === null) {
		return new Response('could not load event from db', { status: 400 });
	}
	if (eventExists === true) {
		return new Response('event already exists', { status: 400 });
	}
	const eventInserted = await insertEvent(event.id);
	if (!eventInserted) {
		return new Response('could not insert event', { status: 400 });
	}
	switch (event.type) {
		case 'checkout.session.completed':
			{
				const checkoutSession: Stripe.Checkout.Session = event.data.object;
				if (checkoutSession.payment_status === 'paid') {
					console.log('Checkout session completed');
					if (!checkoutSession.customer) {
						return new Response('no customer found', { status: 500 });
					}
					if (checkoutSession.metadata == null) {
						return new Response('no user id found', { status: 500 });
					}
					const [addedCustomer, session] = await Promise.all([
						linkCustomerToUser(checkoutSession.customer, checkoutSession.metadata.user_id),
						stripe.checkout.sessions.retrieve(checkoutSession.id, { expand: ['line_items'] })
					]);
					if (!addedCustomer) {
						return new Response('Could not add customer to user', { status: 500 });
					}
					if (session.line_items == null || session.line_items.data[0].price == null) {
						return new Response(undefined, { status: 500 });
					}
					const price_id = session.line_items.data[0].price.id;
					const createdSubscription = await createSubscription(price_id, checkoutSession.metadata.user_id);
					if (!createdSubscription) {
						return new Response('Could not create subscription', { status: 500 });
					}
				}
			}
			break;
		case 'invoice.paid':
			// Continue to provision the subscription as payments continue to be made.
			// Store the status in your database and check when a user accesses your service.
			// This approach helps you avoid hitting rate limits.
			break;
		case 'invoice.payment_failed':
			// The payment failed or the customer does not have a valid payment method.
			// The subscription becomes past_due. Notify your customer and send them to the
			// customer portal to update their payment information.
			break;
		case 'customer.subscription.updated':
			{
				const subscription: Stripe.Subscription = event.data.object;
				if (subscription.cancel_at_period_end) {
					const canceledSubscription = await cancelSubscription(
						subscription.metadata.user_id,
						new Date(subscription.current_period_end).toISOString()
					);
					if (!canceledSubscription) {
						return new Response('Could not cancel subscription', { status: 500 });
					}
				} else {
					if (!subscription.customer || typeof subscription.customer !== 'string') {
						return new Response('no customer found', { status: 500 });
					}
					const updatedSubscription = await updateSubscription(subscription.items.data[0].price.id, subscription.customer);
					if (!updatedSubscription) {
						return new Response('Could not update subscription', { status: 500 });
					}
				}
			}
			break;
		default:
		// Unhandled event type
	}

	return new Response(JSON.stringify({ received: true }), { status: 200 });
}
