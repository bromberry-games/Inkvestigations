import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const loginStatus = getAuthStatus(session);

	if (loginStatus == AuthStatus.LoggedIn) {
		redirect(303, '/home');
	} else if (loginStatus == AuthStatus.AnonymousLogin) {
		//TODO why do I have to return session also? Has sveltekit 2.0 changed the way this works? Is there a bug in this code?
		return { url: url.origin, session };
	}

	return { url: url.origin };
};
