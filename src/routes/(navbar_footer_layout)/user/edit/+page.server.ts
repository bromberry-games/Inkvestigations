import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase_full_access } from '$lib/supabase/supabase_full_access.server.js';

const mainSchema = z.object({
	email: z.string().email()
});

export const load = async ({ locals: { getSession, supabase } }) => {
	const session: Session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}
	const form = await superValidate({ email: session.user.email }, mainSchema);
	return { form };
};

export const actions = {
	save: async ({ request, locals: { getSession } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, mainSchema)]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		if (!form.valid) {
			return fail(400, { form });
		}
		return { form };
	},
	delete: async ({ locals: { getSession, supabase } }) => {
		const session: Session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		const { error: signOutError } = await (supabase as SupabaseClient).auth.signOut();
		if (signOutError) {
			throw signOutError;
		}
		const { error } = await supabase_full_access.auth.admin.deleteUser(session.user.id);
		if (error) {
			throw error;
		}
		throw redirect(303, '/');
	}
};
