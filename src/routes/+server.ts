import type {Actions, RequestEvent } from '@sveltejs/kit';

const odooEndpoint = process.env.ODOO_ENDPOINT;
const odooUser = process.env.ODOO_USERNAME;
const odooToken = process.env.ODOO_API_TOKEN;



export const POST: Actions = {
  default: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    
    const response = await fetch(`${odooEndpoint}`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
      }),
      headers: {
        Authorization: `Bearer ${odooToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();

    return {
      subscribed: response.status === 200,
      error: response.status === 200 ? '' : data?.message,
    };
  },
};