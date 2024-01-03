import { archiveLastConversation } from '$lib/supabase/conversations.server';
import { throwIfFalse } from '$misc/error.js';
import type { Session } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	let mysteries;
	if (session) {
		const { data } = await supabase.from('mysteries').select('*, solved(rating)');
		mysteries = data;
	} else {
		const { data } = await supabase.from('mysteries').select();
		mysteries = data;
	}

	return {
		mysteries: mysteries ?? []
	};
};
