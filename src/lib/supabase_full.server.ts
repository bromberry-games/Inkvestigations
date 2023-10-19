import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { Chat, ChatMessage } from '$misc/shared';

const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function decreaseMessageForUser(userid: string) {
    const { error } = await supabase_full_access.rpc('user_interaction.decrement_message_for_user', { the_user_id: userid })
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
    const { error } = await supabase_full_access.rpc('user_interaction.increase_message_for_user_by_amount', { the_user_id: userid, increase: amount})
    if (error) {
        console.error(error)
    }
}

export async function createSubscription(priceId: string, userId: string) : Promise<boolean> {
    const { error }  = await supabase_full_access
        .rpc('create_subscription', { price_id: priceId, the_user_id: userId });
    if(error) {
        console.error(error);
        return false;
    }
    return true;
}

export interface suspects {
    name: string;
    imagepath: string;
}

export async function getSuspects(mysterName: string) : Promise<suspects[] | null> {
    const { data, error } = await supabase_full_access
        .from('suspects')
        .select('name, imagepath')
        .eq('mystery_name', mysterName);
    if(error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function getMurderer(mysterName: string) : Promise<string | null> {
    const { data, error } = await supabase_full_access
        .from('suspects')
        .select('id, name, murderers!inner(id)')
        .eq('mystery_name', mysterName)
    if(error) {
        console.error(error);
        return null;
    }
    return data?.[0]?.name || null; 
}

export async function setRating(mystery: string, user_id: string, rating: number) : Promise<boolean> {
    const { error } = await supabase_full_access
        .from('solved')
        .insert({ mystery_name: mystery, user_id: user_id, rating: rating})
    if(error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function cancelSubscription(userId: string, endDate: string) : Promise<boolean> {
    const { error } = await supabase_full_access.
        from('user_subscriptions')
        .update({ end_date: endDate })
        .eq('user_id', userId);
    if(error) {
        console.error(error);
        return false;
    } 
    return true;
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

export async function getAccusePrompt(mysteryName: string) : Promise<string | null> {
    const { data, error } = await supabase_full_access
        .from('mystery.mysteries')
        .select('accuse_prompt')
        .eq('name', mysteryName)
        .single();
    if(error) {
        console.error(error);
        return null;
    }
    return data?.accuse_prompt || null;
}

export async function loadChatForUser(userid: string, mystery: string): Promise<Chat | null> {
    // Step 1: Get the conversation_id
    const { data: conversationData, error: conversationError } = await supabase_full_access
        .from('user_mystery_conversations')
        .select('id, created_at, archived')
        .eq('user_id', userid)
        .eq('mystery_name', mystery)
        .order('created_at', { ascending: false})
        .limit(1)

    if (conversationError) {
        console.error("error querying conversation: ", conversationError);
        return null;
    }

    let {id: conversationId, created_at: createdAt} = conversationData && conversationData.length >= 1 ? conversationData[0] : {id: 0, created_at: 0};
    if(!conversationData || conversationData.length == 0 || conversationData[0].archived) {
        const {data: conversationInsertData, error: conversationInsertError } = await supabase_full_access
            .from('user_mystery_conversations')
            .insert({ user_id: userid, mystery_name: mystery })
            .select('id, created_at')
            .single()
        
        if (conversationInsertError) {
            console.error("error inserting conversation: ");
            console.error(conversationInsertError); 
            return null;
        }
        conversationId = conversationInsertData.id
        createdAt = conversationInsertData.created_at
    }

    const {data: mysteryData, error: mysteryError} = await supabase_full_access
        .from('mystery.mysteries')
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
        .eq('conversation_id', conversationId);

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
        created: new Date(createdAt),
        messages,
        prompt: '',  // you might want to define how to derive or set this field
        // other optional fields can be set as needed
    };
}


export async function archiveLastConversation(userid: string, mystery: string): Promise<boolean> {
    const { error: archiveError } = await supabase_full_access
        .from('user_mystery_conversations')
        .update({ archived: true })
        .eq('user_id', userid)
        .eq('mystery_name', mystery)
        .eq('archived', false) 
        .order('created_at', { ascending: false})
        .limit(1);

    if (archiveError) {
        console.error("error archiving the conversation: ", archiveError);
        return false;
    }

    return true; 
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
    const { data: existingMessageData, error: messageCheckError } = await supabase_full_access
        .from('user_mystery_messages')
        .select('id')
        .eq('content', message)
        .eq('conversation_id', conversationData.id)

    if (messageCheckError) {
        console.error("message check error: ");
        console.error(messageCheckError)
        return;
    }

    // If the message already exists, return early to prevent duplicate insertion
    if (existingMessageData && existingMessageData.length > 0) {
        console.warn('Message already exists in the database for this conversation.');
        return;
    }

    const { error: messageError } = await supabase_full_access
        .from('user_mystery_messages')
        .insert({ content: message, conversation_id: conversationId });

    if (messageError) {
        console.error("message error: " + messageError);
        return;
    }
}

