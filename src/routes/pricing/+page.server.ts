import { STRIPE_TEST_KEY} from '$env/static/private';

import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import Stripe from 'stripe'

export const actions = {
  buy: async ({url, locals: {getSession}}) => {
    const user_session = await getSession();

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
      success_url: `${url.origin}/success`,
      cancel_url: `${url.origin}/cancel`,
      //automatic_tax: {enabled: true},
      metadata: {
        user_id: user_session ? user_session.user.id : ''
      }
    });

    if (session.url) {
      throw redirect(303, session.url);
    }
    throw error(420, 'Enhance your calm');
  }
}
