import Stripe from 'stripe';
import { STRIPE_TEST_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { cancelSubscription, createSubscription, updateSubscription } from '$lib/supabase/subscription.server';
import { checkIfEventExists, insertEvent, linkCustomerToUser } from '$lib/supabase/prcing.server';
import { isPostgresError } from '$lib/supabase/helpers.js';
import { increaseMessageForUser } from '$lib/supabase/message_amounts.server';
import { stripeClient } from '$lib/stripe.js';

const stripe = stripeClient;

function response500AndLogError(message: string) {
	console.error(message);
	return new Response(message, { status: 500 });
}

export async function POST({ request }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

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
					if (!checkoutSession.customer || typeof checkoutSession.customer != 'string') {
						return response500AndLogError('no customer found or customer is not of type string');
					}
					if (checkoutSession.metadata == null) {
						return response500AndLogError('no user id found in metadata');
					}
					const [customerUserId, session, oldSubscription] = await Promise.all([
						linkCustomerToUser(checkoutSession.customer, checkoutSession.metadata.user_id),
						stripe.checkout.sessions.retrieve(checkoutSession.id, { expand: ['line_items', 'line_items.data.price.product'] }),
						stripe.subscriptions.list({ customer: checkoutSession.customer, status: 'active' })
					]);
					if (isPostgresError(customerUserId)) {
						return response500AndLogError(customerUserId.message);
					}
					if (session.line_items == null || session.line_items.data[0].price == null) {
						return response500AndLogError('No line item');
					}
					if (session.subscription) {
						if (oldSubscription.data.length > 1) {
							if (session.subscription == null || typeof session.subscription != 'string') {
								return response500AndLogError('Subscription is not of type string');
							}
							const oldSubs = oldSubscription.data.filter((sub) => !sub.id.includes(session.subscription));
							if (oldSubs.length > 1) {
								return response500AndLogError('More than one subscription found');
							}
							const subscription = await stripe.subscriptions.cancel(oldSubs[0].id);
							const cancelDate = new Date().toISOString().split('T')[0];
							const canceledSubscription = await cancelSubscription(customerUserId, subscription.id, cancelDate);
							if (isPostgresError(canceledSubscription)) {
								return response500AndLogError(canceledSubscription.message);
							}
						}
						const getSub = await stripe.subscriptions.retrieve(session.subscription, { expand: ['items.data.price.product'] });
						getSub.items;
						console.log('got sub from id ' + session.subscription);
						console.log(getSub);
						console.log('product');
						console.log(getSub.items.data.map((item) => item.price.product));
						const createdSubscription = await createSubscription(
							getSub.items.data.map((item) => {
								return {
									product_id: (item.price?.product as Stripe.Product).id,
									metered_si: item.price?.recurring?.usage_type == 'metered' ? item.id : null
								};
							}),
							customerUserId,
							getSub.id
						);
						if (isPostgresError(createdSubscription)) {
							return response500AndLogError(createdSubscription.message);
						}
					} else {
						const product = session.line_items.data[0].price.product;
						if (product?.metadata?.messages_amount == null) {
							return response500AndLogError('No messages amount');
						}
						await increaseMessageForUser(customerUserId, product.metadata.messages_amount);
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
					const formattedDate = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0];
					const canceledSubscription = await cancelSubscription(subscription.metadata.user_id, subscription.id, formattedDate);
					if (isPostgresError(canceledSubscription)) {
						return response500AndLogError(canceledSubscription.message);
					}
				} else {
					// if (!subscription.customer || typeof subscription.customer !== 'string') {
					// return return500ResponseAndLogError('no customer found');
					// }
					// const updatedSubscription = await updateSubscription(subscription.items.data[0].price.id, subscription.customer);
					// if (!updatedSubscription) {
					// return return500ResponseAndLogError('Could not update subscription');
					// }
				}
			}
			break;
		default:
		// Unhandled event type
	}

	return new Response(JSON.stringify({ received: true }), { status: 200 });
}
