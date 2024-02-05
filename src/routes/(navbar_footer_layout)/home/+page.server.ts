import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadFirstMystery, loadLastPlayedMysteryOrNextPlayableOne } from '$lib/supabase/conversations.server';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const loginStatus = getAuthStatus(session);

	if (loginStatus != AuthStatus.LoggedIn) {
		redirect(303, '/');
	}

	const [lastPlayed, first] = await Promise.all([loadLastPlayedMysteryOrNextPlayableOne(session.user.id), loadFirstMystery()]);
	isTAndThrowPostgresErrorIfNot(lastPlayed);
	isTAndThrowPostgresErrorIfNot(first);
	return { lastPlayed: lastPlayed[0], first: first[0] };
};
