import { createClient } from '@supabase/supabase-js';
import type { Database } from '../schema';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { Chat, ChatMessage } from '$misc/shared';

const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function getInfoModelMessages(userId: string, mystery: string): Promise<ChatMessage[] | null> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id')
		.eq('user_id', userId)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ');
		console.error(conversationError);
		return null;
	}

	if (!conversationData) {
		console.error('conversation not found');
		return null;
	}

	const { data, error } = await supabase_full_access
		.from('user_mystery_info_messages')
		.select('content')
		.eq('conversation_id', conversationData.id);
	if (error) {
		console.error(error);
		return null;
	}

	const { data: messageData, error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.select('content')
		.eq('conversation_id', conversationData.id);

	if (messageError) {
		console.error(messageError);
		return null;
	}

	const { data: prompData, error: prompError } = await supabase_full_access
		.from('mysteries')
		.select('info_prompt, info_answer')
		.eq('name', mystery);

	if (prompError) {
		console.error(prompError);
		return null;
	}

	const conversation: ChatMessage[] = [
		{ role: 'user', content: prompData[0].info_prompt },
		{ role: 'assistant', content: prompData[0].info_answer }
	];

	data.forEach((item, index) => {
		conversation.push({
			role: 'user',
			content: item.content
		});
		conversation.push({
			role: 'assistant',
			content: messageData[index].content
		});
	});

	return conversation;
}

export async function addInfoModelMessage(userId: string, mystery: string, message: ChatMessage): Promise<boolean> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id')
		.eq('user_id', userId)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ');
		console.error(conversationError);
		return false;
	}

	if (!conversationData) {
		console.error('conversation not found');
		return false;
	}

	const { error } = await supabase_full_access
		.from('user_mystery_info_messages')
		.insert({ content: message, conversation_id: conversationData.id });

	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

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

export async function createSubscription(priceId: string, userId: string): Promise<boolean> {
	const { error } = await supabase_full_access.rpc('create_subscription', { price_id: priceId, the_user_id: userId });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export interface suspects {
	name: string;
	imagepath: string;
}

export async function getSuspects(mysterName: string): Promise<suspects[] | null> {
	const { data, error } = await supabase_full_access.from('suspects').select('name, imagepath').eq('mystery_name', mysterName);
	if (error) {
		console.error(error);
		return null;
	}
	return data;
}

export async function setRating(mystery: string, user_id: string, rating: number): Promise<boolean> {
	const { error } = await supabase_full_access.from('solved').insert({ mystery_name: mystery, user_id: user_id, rating: rating });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function cancelSubscription(userId: string, endDate: string): Promise<boolean> {
	const { error } = await supabase_full_access.from('user_subscriptions').update({ end_date: endDate }).eq('user_id', userId);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function getAccusePrompt(mysteryName: string): Promise<string | null> {
	const { data, error } = await supabase_full_access.from('mysteries').select('accuse_prompt').eq('name', mysteryName).single();
	if (error) {
		console.error(error);
		return null;
	}
	return data?.accuse_prompt || null;
}

//TODO cleanup or postgres function
export async function loadChatForUser(userid: string, mystery: string): Promise<Chat | null> {
	// Step 1: Get the conversation_id
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id, created_at, archived')
		.eq('user_id', userid)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1);

	if (conversationError) {
		console.error('error querying conversation: ', conversationError);
		return null;
	}

	let { id: conversationId, created_at: createdAt } =
		conversationData && conversationData.length >= 1 ? conversationData[0] : { id: 0, created_at: 0 };
	if (!conversationData || conversationData.length == 0 || conversationData[0].archived) {
		const { data: conversationInsertData, error: conversationInsertError } = await supabase_full_access
			.from('user_mystery_conversations')
			.insert({ user_id: userid, mystery_name: mystery })
			.select('id, created_at')
			.single();

		if (conversationInsertError) {
			console.error('error inserting conversation: ');
			console.error(conversationInsertError);
			return null;
		}
		conversationId = conversationInsertData.id;
		createdAt = conversationInsertData.created_at;
	}

	const { data: mysteryData, error: mysteryError } = await supabase_full_access
		.from('mysteries')
		.select('prompt, answer')
		.eq('name', mystery)
		.single();

	if (mysteryError) {
		console.error('error querying mystery: ', mysteryError);
		return null;
	}

	const { data: messageData, error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.select('content, created_at')
		.eq('conversation_id', conversationId);

	if (messageError) {
		console.error('error querying messages: ', messageError);
		return null;
	}

	const messages: ChatMessage[] = [
		{
			content: mysteryData.prompt,
			role: 'user'
		},
		{
			content: mysteryData.answer,
			role: 'assistant'
		}
	];

	messages.push(
		...messageData.map(
			(message, index): ChatMessage => ({
				id: String(index), // assuming messages have no unique ID in your database
				content: message.content,
				role: index % 2 === 0 ? 'user' : 'assistant'
			})
		)
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
		prompt: '' // you might want to define how to derive or set this field
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
		.order('created_at', { ascending: false })
		.limit(1);

	if (archiveError) {
		console.error('error archiving the conversation: ', archiveError);
		return false;
	}

	return true;
}

export async function addMessageForUser(userid: string, message: string, mystery: string): Promise<boolean> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id')
		.eq('user_id', userid)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ');
		console.error(conversationError);
		return false;
	}

	if (!conversationData) {
		console.error('conversation not found');
		return false;
	}

	const { error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.insert({ content: message, conversation_id: conversationData.id });

	if (messageError) {
		console.error('message error: ' + messageError);
		return false;
	}
	return true;
}
