import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createTemporaryUser } from '$lib/supabase/temporary_users.server';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	throw redirect(303, '/login');
	const session = await getSession();
	const authStatus = getAuthStatus(session);
	if (authStatus == AuthStatus.LoggedIn) {
		throw redirect(303, '/mysteries');
	} else if (authStatus == AuthStatus.LoggedOut) {
		const user = await createTemporaryUser();
		return { user };
	}
	return { user: null };
};
