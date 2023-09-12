import Stripe from 'stripe'
import { STRIPE_TEST_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { increaseMessageAmountForUserByAmount } from '$lib/supabase_full';
import { getAmountForPrice } from '../../pricing/pricing_const';

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
  if (event.type == 'checkout.session.completed') {
    //const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
    //    event.data.object.id,
    //    {
    //      expand: ['line_items'],
    //    }
    //);
    //console.log(sessionWithLineItems)
    //const lineItems = sessionWithLineItems.line_items;
    //if (lineItems) {
    //    //fulfillOrder(lineItems, sessionWithLineItems.metadata.user_id);
    //}
  } else if (event.type == 'customer.subscription.updated') {
    const subscription = event.data.object;
    console.log("subscription updated")
    console.log("user id: ", subscription.metadata.user_id);
    await handleSubscriptionUpdated(subscription.plan.id, subscription.metadata.user_id);
  }


  return new Response(JSON.stringify({received: true}), { status: 200 })
}

async function handleSubscriptionUpdated(price: string, user_id: string) {
  await increaseMessageAmountForUserByAmount(user_id, getAmountForPrice(price))
}

