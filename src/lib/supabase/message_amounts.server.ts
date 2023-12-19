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

export async function getMessageAmountForUser(userid: string): Promise<number> {
	const { data, error } = await supabase_full_access.from('user_messages').select('amount').eq('user_id', userid).single();
	if (error) {
		console.error(error);
	}
	if (!data?.amount) {
		return 0;
	}
	return data.amount;
}
