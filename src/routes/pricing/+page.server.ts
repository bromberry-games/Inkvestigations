import { STRIPE_TEST_KEY} from '$env/static/private';

import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import Stripe from 'stripe'
import { name_to_price_map } from './pricing_const';

const stripe = new Stripe(STRIPE_TEST_KEY, {
    apiVersion: '2022-11-15'
});

export const load = async () => {
  const prices = [];
  for (const key in name_to_price_map) {
    const price = await stripe.prices.retrieve(name_to_price_map[key], {expand: ['product']});
    if(!price.unit_amount) {
      throw Error("no unit amount");
    }
    prices.push({
      id: price.id,
      currency: price.currency,
      unit_amount: price.unit_amount,
      product_name: (price.product as Stripe.Product).name
    })
  }
  return {prices: prices};
}

export const actions = {
  buy: async ({url, request, locals: {getSession}}) => {
    const user_session = await getSession();
    const form_data = request.formData();
    const price = (await form_data).get('price_id') as string;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${url.origin}/success`,
      cancel_url: `${url.origin}/cancel`,
      automatic_tax: {enabled: true},
      subscription_data: {
        metadata: {
          user_id: user_session ? user_session.user.id : ''
        }
      },
    });

    if (session.url) {
      throw redirect(303, session.url);
    }
    throw error(420, 'Enhance your calm');
  }
}
