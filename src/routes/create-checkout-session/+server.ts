import { STRIPE_TEST_KEY, DOMAIN } from '$env/static/private';

import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe'



export async function POST() {
    const stripe = new Stripe(STRIPE_TEST_KEY, {
        apiVersion: '2022-11-15'
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1NaloJKIDbJkcynJshhB7EsM',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
    });
    if (session.url) {
      throw redirect(303, session.url);
    }
    throw error(420, 'Enhance your calm');
}
