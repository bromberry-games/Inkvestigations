import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession } }) => {
	if (getSession) {
		const session = await getSession();
		const authStatus = getAuthStatus(session);
		if (authStatus == AuthStatus.LoggedIn) {
			redirect(303, '/home');
		}
	}
};
