import { supabase_full_access } from './supabase_full_access.server';

export async function loadActiveSubscriptions() {
	const { data, error } = await supabase_full_access
		.from('subscription_tiers')
		.select('name, description, daily_message_limit, stripe_price_id')
		.eq('active', true);

	if (error) {
		console.error(error);
		return null;
	}

	return data;
}
