import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers.js';
import { createNewUserMystery, deleteMystery, loadUserMysteries } from '$lib/supabase/mystery_data.server';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}

	const mysteries = await loadUserMysteries(session.user.id);
	isTAndThrowPostgresErrorIfNot(mysteries);
	return { mysteries };
};

export const actions = {
	delete: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		const formData = await request.formData();
		const id = formData.get('mystery-id')?.toString();
		if (!id) {
			throw error(500, 'Could not find mystery name');
		}
		const deleted = await deleteMystery(id, session.user.id);
		isTAndThrowPostgresErrorIfNot(deleted);
	},
	create: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		const created = await createNewUserMystery(session.user.id);
		isTAndThrowPostgresErrorIfNot(created);
		redirect(303, '/user/mysteries/' + created.id);
	}
};
