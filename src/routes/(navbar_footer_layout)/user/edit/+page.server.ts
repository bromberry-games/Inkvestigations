import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase_full_access } from '$lib/supabase/supabase_full_access.server.js';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server.js';

const mainSchema = z.object({
	email: z.string().email()
});

export const load = async ({ locals: { getSession, supabase } }) => {
	const session: Session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}
	const [form, activeSub] = await Promise.all([
		superValidate({ email: session.user.email }, mainSchema),
		loadActiveAndUncancelledSubscription(session.user.id)
	]);
	if (!activeSub) {
		throw error(404, 'Subscription not found');
	}
	return { form, activeSub: activeSub.id != null };
};

export const actions = {
	save: async ({ request, locals: { getSession, supabase } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, mainSchema)]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		if (!form.valid) {
			return fail(400, { form });
		}
		if ((session as Session).user.email != form.data.email) {
			const { error } = await supabase.auth.updateUser({ email: form.data.email });
			if (error) {
				throw error;
			}
		}

		return message(form, 'Your email has been updated');
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
		throw redirect(303, '/confirmations/account-deleted');
	}
};
