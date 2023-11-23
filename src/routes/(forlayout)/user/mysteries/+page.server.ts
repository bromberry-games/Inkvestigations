import { AuthStatus, getAuthStatus } from '$lib/auth-helper';
import { deleteMystery, loadMysteries } from '$lib/supabase/mystery_data.server';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}

	const mysteries = await loadMysteries(session.user.id);
	if (mysteries === null) {
		throw error(500, 'Error loading mysteries');
	}
	return { mysteries: mysteries ? mysteries : [] };
};

export const actions = {
	delete: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		const formData = await request.formData();
		const mysteryName = formData.get('mystery-name')?.toString();
		if (!mysteryName) {
			throw error(500, 'Could not find mystery name');
		}
		const deleted = await deleteMystery(mysteryName, session.user.id);
		if (!deleted) {
			throw error(500, 'Error deleting mystery');
		}
	}
};
