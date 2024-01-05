import { AIMessage, BaseMessage, HumanMessage } from 'langchain/schema';
import { supabase_full_access } from './supabase_full_access.server';
import type { ChatMessage } from '$misc/shared';
import type { BrainOutput } from '../../routes/api/ask/llangchain_ask';
import type { PostgrestError } from '@supabase/supabase-js';
import { isPostgresError } from './helpers';

export async function loadBrainMessages(userId: string, mystery: string): Promise<BrainOutput[] | PostgrestError> {
	const conversationId = await getOrCreateConversationId(userId, mystery);
	if (isPostgresError(conversationId)) {
		console.error(conversationId);
		return conversationId;
	}
	const { data, error } = await supabase_full_access
		.from('user_mystery_brain_messages')
		.select('mood, info, chainOfThought:chain_of_thought')
		.eq('conversation_id', conversationId);
	if (error) {
		console.error(error);
		return error;
	}
	return data ? data : [];
}

export async function addInfoModelMessage(userId: string, mystery: string, message: BrainOutput): Promise<boolean> {
	const conversationId = await getOrCreateConversationId(userId, mystery);
	if (isPostgresError(conversationId)) {
		console.error(conversationId);
		return false;
	}

	const { error } = await supabase_full_access
		.from('user_mystery_brain_messages')
		.insert({ chain_of_thought: message.chainOfThought, info: message.info, mood: message.mood, conversation_id: conversationId });

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

async function getOrCreateConversationId(userid: string, mystery: string): Promise<number | PostgrestError> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('user_mystery_conversations')
		.select('id, archived')
		.eq('user_id', userid)
		.eq('mystery_name', mystery)
		.order('created_at', { ascending: false })
		.limit(1);

	if (conversationError) {
		console.error('error querying conversation: ');
		console.error(conversationError);
		return conversationError;
	}

	if (conversationData && conversationData.length > 0 && !conversationData[0].archived) {
		return conversationData[0].id;
	}

	const { data: conversationInsertData, error: conversationInsertError } = await supabase_full_access
		.from('user_mystery_conversations')
		.insert({ user_id: userid, mystery_name: mystery })
		.select('id, created_at')
		.single();

	if (conversationInsertError) {
		console.error('error inserting conversation: ', conversationInsertError);
		return conversationInsertError;
	}

	return conversationInsertData.id;
}

async function loadLetterMessagesFromConvId(conversationId: number): Promise<ChatMessage[] | PostgrestError> {
	const { data: messageData, error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.select('content, created_at')
		.eq('conversation_id', conversationId);

	if (messageError) {
		console.error('error querying messages: ', messageError);
		return messageError;
	}

	const messages: ChatMessage[] = messageData.map(
		(message, index): ChatMessage => ({
			content: message.content,
			role: index % 2 === 0 ? 'user' : 'assistant'
		})
	);

	return messages;
}

export async function loadLetterMessages(userId: string, mystery: string): Promise<ChatMessage[] | PostgrestError> {
	const conversationId = await getOrCreateConversationId(userId, mystery);
	if (isPostgresError(conversationId)) {
		return conversationId;
	}
	return await loadLetterMessagesFromConvId(conversationId);
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
	const conversationId = await getOrCreateConversationId(userid, mystery);
	if (isPostgresError(conversationId)) {
		console.error(conversationId);
		return false;
	}

	const { error: messageError } = await supabase_full_access
		.from('user_mystery_messages')
		.insert({ content: message, conversation_id: conversationId });

	if (messageError) {
		console.error('message error: ' + messageError);
		return false;
	}
	return true;
}
