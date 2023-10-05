import type { Chat, ChatMessage } from "$misc/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadChatForUser(userid: string, mystery: string, supabase: SupabaseClient): Promise<Chat | null> {
    // Step 1: Get the conversation_id
    mystery = mystery.replace(/_/g, ' ');

    const { data: conversationData, error: conversationError } = await supabase
        .from('user_mystery_conversations')
        .select('id, created_at')
        .eq('user_id', userid)
        .eq('mystery_name', mystery)
        .order('created_at', { ascending: false})
        .limit(1)
        .single();  

    if (conversationError || !conversationData) {
        console.error("error querying conversation: ", conversationError);
        return null;
    }
    console.log("conversationdata: ")
    console.log(conversationData.id)

    const {data: mysteryData, error: mysteryError} = await supabase
        .from('mysteries')
        .select('prompt, answer')
        .eq('name', mystery)
        .single();
    
    if(mysteryError) {
        console.error("error querying mystery: ", mysteryError);
        return null;
    }

    const { data: messageData, error: messageError } = await supabase
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
