import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const loginStatus = getAuthStatus(session);

	if (loginStatus == AuthStatus.LoggedIn) {
		throw redirect(303, '/mysteries');
	}

	return { url: url.origin };
};
