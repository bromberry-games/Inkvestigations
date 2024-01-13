import { supabase_full_access } from './supabase_full_access.server';

export async function createSubscription(productIds: { product_id: string; metered_si: string | null }[], userId: string, subId: string) {
	const { error } = await supabase_full_access.from('user_subs').insert({
		sub_id: subId,
		user_id: userId,
		products: productIds
	});
	if (error) {
		return error;
	}
	return true;
}

export async function cancelSubscription(userId: string, sub_id: string, endDate: string) {
	const { error } = await supabase_full_access.from('user_subs').update({ end_date: endDate }).eq('user_id', userId).eq('sub_id', sub_id);
	if (error) {
		return error;
	}
	return true;
}

export async function updateSubscription(priceId: string, stripe_customer: string): Promise<boolean> {
	const { error } = await supabase_full_access.rpc('update_subscription', { price_id: priceId, stripe_customer });
	if (error) {
		console.error('error updating subscription');
		console.error(error);
		return false;
	}
	return true;
}
