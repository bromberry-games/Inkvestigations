import Stripe from 'stripe'
import { STRIPE_TEST_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { createSubscription, increaseMessageAmountForUserByAmount } from '$lib/supabase_full.server';
import { getAmountForPrice } from '../../pricing/pricing_const';
import { error } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_TEST_KEY, {
        apiVersion: '2022-11-15'
});

export async function POST({ request }) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  console.log("webhook hit");
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature as string, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    return new Response(undefined, { status: 400 })
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession: Stripe.Checkout.Session = event.data.object;
      if(checkoutSession.payment_status === 'paid') {
        const session = await stripe.checkout.sessions.retrieve(checkoutSession.id, { expand: ['line_items'] });
        console.log(checkoutSession)
        console.log(session)
        if(session.line_items == null) {
          //throw error(500, 'could not load session line items');
          return new Response(undefined, { status: 500 });
        } 
        console.log(session.line_items.data[0])
        if (session.metadata.user_id == null) {
          return new Response(undefined, { status: 500 });
          //throw error(500, 'could not load session user id');
        }
        const price_id = session.line_items.data[0].price.id;
        createSubscription(price_id, checkoutSession.metadata.user_id);
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
    default:
      // Unhandled event type
  }
  // else if (event.type == 'customer.subscription.updated') {
  //  const subscription : Stripe.Subscription= event.data.object;
  //  const item : Stripe.SubscriptionItem = subscription.items.data[0];
  //  await handleSubscriptionUpdated(item.price.id, subscription.metadata.user_id);
  //}


  return new Response(JSON.stringify({received: true}), { status: 200 })
}

async function handleSubscriptionUpdated(price: string, user_id: string) {

}

