import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

export const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function decreaseMessageForUser(userid: string) {
    await supabase_full_access.rpc('decrement_message_for_user', { the_user_id: userid })
}

export async function getMessageAmountForUser(userid: string): number {
    const { data } = await supabase_full_access.from('user_messages').select('amount').eq('user_id', userid).single();
    return data.amount
}

export async function increaseMessageAmountForUserByAmount(userid: string, amount: number) {
    const { error } = await supabase_full_access.rpc('increase_message_for_user_by_amount', { the_user_id: userid, increase: amount})
    if (error) {
        console.error(error)
    }
}