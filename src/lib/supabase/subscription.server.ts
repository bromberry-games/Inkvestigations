import { supabase_full_access } from './supabase_full_access.server';

export async function createSubscription(priceId: string, userId: string): Promise<boolean> {
	const { error } = await supabase_full_access.rpc('create_subscription', { price_id: priceId, the_user_id: userId });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function cancelSubscription(userId: string, endDate: string): Promise<boolean> {
	const { error } = await supabase_full_access.from('user_subscriptions').update({ end_date: endDate }).eq('user_id', userId);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function updateSubscription(priceId: string, stripe_customer: string): Promise<boolean> {
	console.log(`updating priceId: ${priceId}, stripe_customer: ${stripe_customer}`);
	const { error } = await supabase_full_access.rpc('update_subscription', { price_id: priceId, stripe_customer });
	if (error) {
		console.error('error updating subscription');
		console.error(error);
		return false;
	}
	return true;
}
