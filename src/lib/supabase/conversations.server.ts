import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { supabase_full_access } from './supabase_full_access.server';
import type { ChatMessage } from '$misc/shared';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../schema';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

export async function getInfoModelMessages(userId: string, mystery: string): Promise<BaseMessage[] | null> {
	const conversationId = await getOrCreateConversationId(userId, mystery);

	const { data: infoMessageData, error } = await supabase_full_access
		.from('user_mystery_info_messages')
		.select('content')
		.eq('conversation_id', conversationId);
	if (error) {
		console.error(error);
		return null;
	}

	const { data: messageData, error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.select('content')
		.eq('conversation_id', conversationId);

	if (messageError) {
		console.error(messageError);
		return null;
	}

	const conversation: BaseMessage[] = [];

	infoMessageData.forEach((item, index) => {
		conversation.push(
			new HumanMessage({
				content: messageData[index].content
			})
		);
		conversation.push(
			new AIMessage({
				content: item.content
			})
		);
	});

	return conversation;
}

export async function addInfoModelMessage(userId: string, mystery: string, message: string): Promise<boolean> {
	const conversationId = await getOrCreateConversationId(userId, mystery);

	const { error } = await supabase_full_access
		.from('user_mystery_info_messages')
		.insert({ content: message, conversation_id: conversationId });

	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function setRating(mystery: string, user_id: string, rating: number): Promise<boolean> {
	const { error } = await supabase_full_access.from('solved').insert({ mystery_name: mystery, user_id: user_id, rating: rating });
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

async function getOrCreateConversationId(userid: string, mystery: string): Promise<number | null> {
	console.log('getting or creating conversation id');
	console.log(userid, mystery);
	console.log(supabase_full_access);

	const { data: mysteryData, error: mysteryError } = await supabase_full_access.from('user_messages').select('*');
	console.log('mystery data: from different select');
	console.log(mysteryData);

	console.log('other select');
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id, archived')
		.eq('user_id', userid)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1);

	console.log('got conversation id');
	if (conversationError) {
		console.error('error querying conversation: ');
		console.error(conversationError);
		return null;
	}
	console.log(conversationData);

	if (conversationData && conversationData.length > 0 && !conversationData[0].archived) {
		return conversationData[0].id;
	}
	console.log('creating new conversation');

	const { data: conversationInsertData, error: conversationInsertError } = await supabase_full_access
		.from('user_mystery_conversations')
		.insert({ user_id: userid, mystery_name: mystery })
		.select('id, created_at')
		.single();

	if (conversationInsertError) {
		console.error('error inserting conversation: ', conversationInsertError);
		return null;
	}

	return conversationInsertData.id;
}

async function loadDisplayMessagesFromConvId(conversationId: number): Promise<ChatMessage[] | null> {
	const { data: messageData, error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.select('content, created_at')
		.eq('conversation_id', conversationId);

	if (messageError) {
		console.error('error querying messages: ', messageError);
		return null;
	}

	const messages: ChatMessage[] = messageData.map(
		(message, index): ChatMessage => ({
			content: message.content,
			role: index % 2 === 0 ? 'user' : 'assistant'
		})
	);

	return messages;
}

export async function loadDisplayMessages(userId: string, mystery: string): Promise<ChatMessage[] | null> {
	const conversationId = await getOrCreateConversationId(userId, mystery);
	return conversationId ? await loadDisplayMessagesFromConvId(conversationId) : null;
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
	console.log('adding message for user');
	const conversationId = await getOrCreateConversationId(userid, mystery);
	if (!conversationId) {
		console.log('no conversation id');
		return false;
	}
	console.log('conversation id: ');
	console.log(conversationId);

	const { error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.insert({ content: message, conversation_id: conversationId });

	if (messageError) {
		console.error('message error: ' + messageError);
		return false;
	}
	console.log('succesfully added message for user');
	return true;
}
