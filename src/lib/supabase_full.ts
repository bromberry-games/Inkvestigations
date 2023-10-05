import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { Chat, ChatMessage } from '$misc/shared';

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

export async function addConversationForUser(userid: string, mystery: string) {
    const { error } = await supabase_full_access
            .from('user_mystery_conversations')
            .upsert({ user_id: userid, mystery_name: mystery })
        
    if (error) {
        console.error("error inserting conversation: ");
        console.error(error); 
        return;
    }
}


export async function loadChatForUser(userid: string, mystery: string): Promise<Chat | null> {
    // Step 1: Get the conversation_id
    mystery = mystery.replace(/_/g, ' ');
    const { data: conversationData, error: conversationError } = await supabase_full_access
        .from('user_mystery_conversations')
        .select('id, created_at')
        .eq('user_id', userid)
        .eq('mystery_name', mystery)
        .order('created_at', { ascending: true})
        .limit(1)
        .single();  

    if (conversationError || !conversationData) {
        console.error("error querying conversation: ", conversationError);
        return null;
    }

    const {data: mysteryData, error: mysteryError} = await supabase_full_access
        .from('mysteries')
        .select('prompt, answer')
        .eq('name', mystery)
        .single();
    
    if(mysteryError) {
        console.error("error querying mystery: ", mysteryError);
        return null;
    }

    const { data: messageData, error: messageError } = await supabase_full_access
        .from('user_mystery_messages')
        .select('content, created_at')
        .eq('conversation_id', conversationData.id);

    if (messageError) {
        console.error("error querying messages: ", messageError);
        return null;
    }

    const messages: ChatMessage[] = [
        {
            content: mysteryData.prompt,
            role: 'user',
        },
        {
            content: mysteryData.answer,
            role: 'assistant',
        }
    ]

    messages.push(
        ...messageData.map((message, index): ChatMessage => ({
            id: String(index),  // assuming messages have no unique ID in your database
            content: message.content,
            role: index % 2 === 0 ? 'user' : 'assistant',
        }))
    );


    // Construct and return the Chat object
    return {
        title: mystery,
        contextMessage: {
			role: 'system',
			content: ''
		},
        created: new Date(conversationData.created_at),
        messages,
        prompt: '',  // you might want to define how to derive or set this field
        // other optional fields can be set as needed
    };
}


export async function addMessageForUser(userid: string, message: string, mystery: string) {
    const {data: conversationData, error: conversationError} = await supabase_full_access
        .from('user_mystery_conversations')
        .select('id')
        .eq('user_id', userid)
        .eq('mystery_name', mystery)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (conversationError) {
        console.error("conversation error: ");
        console.error(conversationError);
        return;
    }

    if(!conversationData) {
        console.error("conversation not found");
        return;
    }

    let conversationId = conversationData?.id;
    if (!conversationData || !conversationData?.id) {
        const { data: conversation_insert_data , error: insertError } = await supabase_full_access
            .from('user_mystery_conversations')
            .insert({ user_id: userid, mystery_name: mystery })
            .select('id')
            .single();

        if (insertError) {
            console.error("insert error: ");
            console.error(insertError);
            return;
        }
        
        conversationId = conversation_insert_data?.id;
    } else {
        const { data: existingMessageData, error: messageCheckError } = await supabase_full_access
            .from('user_mystery_messages')
            .select('id')
            .eq('content', message)
            .eq('conversation_id', conversationData.id)
            .single();

        if (messageCheckError) {
            console.error("message check error: " + messageCheckError);
        }

        // If the message already exists, return early to prevent duplicate insertion
        if (existingMessageData && existingMessageData.id) {
            console.warn('Message already exists in the database for this conversation.');
            return;
        }
    }

    const { error: messageError } = await supabase_full_access
        .from('user_mystery_messages')
        .insert({ content: message, conversation_id: conversationId });

    if (messageError) {
        console.error("message error: " + messageError);
        return;
    }
}

