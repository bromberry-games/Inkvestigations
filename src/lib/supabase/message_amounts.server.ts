import type { PostgrestError } from '@supabase/supabase-js';
import { supabase_full_access } from './supabase_full_access.server';

export async function decreaseMessageForUser(userid: string): Promise<boolean> {
	const { error } = await supabase_full_access.rpc('decrement_message_for_user', { the_user_id: userid });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function getMessageAmountForUser(userid: string) {
	const { data, error } = await supabase_full_access
		.from('user_messages')
		.select('amount, non_refillable_amount')
		.eq('user_id', userid)
		.single();
	if (error) {
		console.error(error);
	}
	return data == null ? { amount: 0, non_refillable_amount: 0 } : data;
}

export async function increaseMessageForUser(userid: string, amount: number): Promise<boolean | PostgrestError> {
	const { error } = await supabase_full_access.rpc('increase_message_for_user_by_amount', { the_user_id: userid, increase: amount });
	if (error) {
		return error;
	}
	return true;
}
