import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

export async function addMessageForUser(userid: string, message: string, mystery: string) {
    const {data: conversationData, error: conversationError} = await supabase_full_access
        .from('user_mystery_conversations')
        .select('id')
        .eq('user_id', userid)
        .eq('myster_name', mystery)
        .single();

    if (conversationError) {
        console.error(conversationError);
    }


    let conversationId = conversationData?.id;
    if (!conversationData || !conversationData?.id) {
        const { data: conversation_insert_data , error: insertError } = await supabase_full_access
            .from('user_mystery_conversations')
            .insert({ user_id: userid, myster_name: mystery })
            .select('id')
            .single();

        if (insertError) {
            console.error(insertError);
        }
        
        conversationId = conversation_insert_data?.id;
    } else {
        //TODO check if the message is in the database

    }


    const { error: messageError } = await supabase_full_access
        .from('user_mystery_messages')
        .insert({ content: message, conversation_id: conversationId });

    if (messageError) {
        console.error(messageError);
    }
}
