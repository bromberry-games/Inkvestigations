import Stripe from 'stripe'
import { STRIPE_TEST_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { increaseMessageAmountForUserByAmount } from '$lib/supabase';

const stripe = new Stripe(STRIPE_TEST_KEY, {
        apiVersion: '2022-11-15'
});

export async function POST({ request }) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  try {
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
    if (event.type == 'charge.succeeded') {
        console.log(event.data)
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ['line_items'],
            }
        );
        console.log("Session: ", sessionWithLineItems);
        console.log("fucking line!")
        console.log("Line items: ", sessionWithLineItems.line_items);
        const lineItems = sessionWithLineItems.line_items;
        if (lineItems) {
            fulfillOrder(lineItems);
        }
    }
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    return new Response(undefined, { status: 400 })
  }


  return new Response(undefined)
}

function fulfillOrder(lineItems: Stripe.ApiList<Stripe.LineItem>) {
}
