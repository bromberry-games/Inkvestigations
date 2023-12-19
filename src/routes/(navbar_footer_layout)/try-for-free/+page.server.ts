import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkIfCanCreateTempUser, createTemporaryUser } from '$lib/supabase/temporary_users.server';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const authStatus = getAuthStatus(session);
	if (authStatus == AuthStatus.LoggedIn) {
		throw redirect(303, '/mysteries');
	} else if (authStatus == AuthStatus.LoggedOut) {
		const canCreateUser = await checkIfCanCreateTempUser();
		isTAndThrowPostgresErrorIfNot(canCreateUser);
		if (canCreateUser) {
			const user = await createTemporaryUser();
			isTAndThrowPostgresErrorIfNot(user);
			return { user };
		}
		throw redirect(303, '/confirmations/for-free-users-exhausted');
	}
	return { user: null };
};
