import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

export const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function decreaseMessageForUser(userid: string) {
    const { error } = await supabase_full_access.rpc('decrement_message_for_user', { the_user_id: userid })
    if (error) {
        console.error(error)
    }
}

export async function getMessageAmountForUser(userid: string): Promise<number> {
    const { data, error } = await supabase_full_access.from('user_messages').select('amount').eq('user_id', userid).single();
    if (error) {
        console.error(error)
    }
    if (!data?.amount) {
        return 0
    }
    return data.amount
}

export async function increaseMessageAmountForUserByAmount(userid: string, amount: number) {
    const { error } = await supabase_full_access.rpc('increase_message_for_user_by_amount', { the_user_id: userid, increase: amount})
    if (error) {
        console.error(error)
    }
}

export async function createConversationForUserAndMystery(userid: string, mystery: string) {
    const { error } = await supabase_full_access.from('conversations').insert({ user_id: userid, myster_name: mystery })
    if (error) {
        console.error(error)
    }
}

export async function storeMessageInDatabase(message: string, conversationId: string) {
    const { error } = await supabase_full_access.from('user_mystery_messages').insert({ 
        content: message, conversation_id: conversationId 
    });
    if (error) {
        console.error(error)
    }
}