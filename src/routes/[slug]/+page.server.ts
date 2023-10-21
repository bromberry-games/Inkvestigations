import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { getSuspects, loadChatForUser } from '$lib/supabase_full.server';

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { slug } = params;
	const mysteryName = slug.replace(/_/g, ' ');
	const chat = await loadChatForUser(session.user.id, mysteryName);
	const suspects = await getSuspects(mysteryName);
	if (!chat) {
		throw error(500, 'could not load chat from data');
	}
	return { chat: chat, suspects: suspects };
};
