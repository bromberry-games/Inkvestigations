import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}

	//return {};
};
