import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AuthStatus, getAuthStatus } from '$lib/auth-helper';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();
	const loginStatus = getAuthStatus(session);

	console.log('loginStatus', loginStatus);
	if (loginStatus == AuthStatus.LoggedIn) {
		redirect(303, '/mysteries');
	}

	//TODO why do I have to do that? Has sveltekit 2.0 changed the way this works?
	return { url: url.origin, session };
};
