import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/schema';
import 'dotenv/config';

const SUPABASE_SERVICE_KEY = process.env.ENV_TO_TEST == 'DEV' ? process.env.SUPABASE_DEV_SERVICE_KEY : process.env.SUPABASE_SERVICE_KEY;
const PUBLIC_SUPABASE_URL = process.env.ENV_TO_TEST == 'DEV' ? process.env.SUPBASE_DEV_URL : process.env.PUBLIC_SUPABASE_URL;
if (!SUPABASE_SERVICE_KEY || !PUBLIC_SUPABASE_URL) {
	throw new Error('Missing SUPABASE_SERVICE_KEY or PUBLIC_SUPABASE_URL');
}
export const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function deleteLastMessageForUser(userId: string) {
	const { data: lastMessage, error: fetchError } = await supabase_full_access
		.from('user_mystery_messages')
		.select(
			`
        id,
        user_mystery_conversations (user_id)
      `
		)
		// Filter by user_id in joined table
		.eq('user_mystery_conversations.user_id', userId)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (fetchError) throw fetchError;
	if (!lastMessage) throw new Error('No message found for this user.');

	const { error: deleteError } = await supabase_full_access.from('user_mystery_messages').delete().match({ id: lastMessage.id });

	if (deleteError) throw deleteError;
}

export async function deleteLastBrainMessage(userId: string) {
	const { data: lastMessage, error: fetchError } = await supabase_full_access
		.from('user_mystery_brain_messages')
		.select(
			`
        id,
        user_mystery_conversations (user_id)
      `
		)
		// Filter by user_id in joined table
		.eq('user_mystery_conversations.user_id', userId)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (fetchError) throw fetchError;
	if (!lastMessage) throw new Error('No message found for this user.');

	const { error: deleteError } = await supabase_full_access.from('user_mystery_brain_messages').delete().match({ id: lastMessage.id });

	if (deleteError) throw deleteError;
}
