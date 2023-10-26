import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { getSuspects, loadUserUIMessages } from '$lib/supabase_full.server';

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { slug } = params;
	const mysteryName = slug.replace(/_/g, ' ');
	const messages = await loadUserUIMessages(session.user.id, mysteryName);
	if (!messages) {
		throw error(500, 'could not load chat from data');
	}
	const suspects = await getSuspects(mysteryName);
	if (!suspects) {
		throw error(500, 'could not suspects chat from data');
	}
	return { messages: messages, suspects: suspects };
};
