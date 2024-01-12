import type { PostgrestError } from '@supabase/supabase-js';
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

export async function linkCustomerToUser(customer_id: string, user_id: string): Promise<string | PostgrestError> {
	const { data: existing, error: selectError } = await supabase_full_access
		.from('stripe_customers')
		.select('*')
		.eq('customer_id', customer_id)
		.eq('user_id', user_id);

	if (selectError) {
		return selectError;
	}
	if (existing && existing.length > 0) {
		return user_id;
	}

	const { error: insertError } = await supabase_full_access.from('stripe_customers').insert({ customer_id, user_id });

	if (insertError) {
		return insertError;
	}

	return user_id;
}

export async function getStripeCustomer(userId: string) {
	const { data, error } = await supabase_full_access.from('stripe_customers').select('customer_id').eq('user_id', userId);
	if (error) {
		return error;
	}
	return data != null && data.length > 0 ? data[0].customer_id : '';
}

export async function loadActiveAndUncancelledSubscription(user_id: string) {
	const { data, error } = await supabase_full_access
		.from('user_subscriptions')
		.select('subscriptions(stripe_price_id)')
		.eq('user_id', user_id)
		.eq('active', true)
		.is('end_date', null);

	if (error) {
		console.error('Error fetching subscription', error);
		return error;
	}
	//No item should ever be null here
	for (const subscription of data) {
		if (subscription == null) {
			throw new Error('Subscription not found');
		}
	}

	return data.filter((sub) => !sub.subscriptions?.stripe_price_id.includes('test'));
}

export async function checkIfEventExists(eventId: string): Promise<boolean | null> {
	const { data, error } = await supabase_full_access.from('stripe_events').select('id').eq('event_id', eventId);
	if (error) {
		console.error(error);
		return null;
	}
	return data.length > 0;
}

export async function insertEvent(eventId: string) {
	const { error } = await supabase_full_access.from('stripe_events').insert({ event_id: eventId });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}
