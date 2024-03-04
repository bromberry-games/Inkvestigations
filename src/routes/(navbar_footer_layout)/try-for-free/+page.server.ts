import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkIfCanCreateTempUser, createTemporaryUser } from '$lib/supabase/temporary_users.server';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import { loadMysteryWithOrder1 } from '$lib/supabase/mystery_data.server';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const authStatus = getAuthStatus(session);
	if (authStatus == AuthStatus.LoggedIn) {
		redirect(303, '/home');
	} else if (authStatus == AuthStatus.LoggedOut) {
		const canCreateUser = await checkIfCanCreateTempUser();
		isTAndThrowPostgresErrorIfNot(canCreateUser);
		if (canCreateUser) {
			const [user, slug] = await Promise.all([createTemporaryUser(), loadMysteryWithOrder1()]);
			isTAndThrowPostgresErrorIfNot(user);
			isTAndThrowPostgresErrorIfNot(slug);
			return { user, slug };
		}
		redirect(303, '/confirmations/for-free-users-exhausted');
	}
	return { user: null };
};
