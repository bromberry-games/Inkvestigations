import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase_full_access } from '$lib/supabase/supabase_full_access.server.js';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server.js';

const mainSchema = z.object({
	email: z.string().email(),
	useMyOwnToken: z.boolean()
});

export const load = async ({ locals: { getSession, supabase } }) => {
	const session: Session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		redirect(303, '/');
	}
	const [form, activeSub] = await Promise.all([
		superValidate({ email: session.user.email, useMyOwnToken: session.user.user_metadata.useMyOwnToken ?? false }, mainSchema),
		loadActiveAndUncancelledSubscription(session.user.id)
	]);
	if (!activeSub) {
		error(404, 'Subscription not found');
	}
	return { form, activeSub: activeSub.id != null };
};

export const actions = {
	save: async ({ request, locals: { getSession, supabase } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, mainSchema)]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			redirect(303, '/');
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

		const { data: user, error } = await (supabase as SupabaseClient).auth.updateUser({
			data: { useMyOwnToken: form.data.useMyOwnToken }
		});
		if (error) throw error;

		return message(form, 'Your settings have been updated');
	},
	delete: async ({ locals: { getSession, supabase } }) => {
		const session: Session = await getSession();
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			redirect(303, '/');
		}
		const { error: signOutError } = await (supabase as SupabaseClient).auth.signOut();
		if (signOutError) {
			throw signOutError;
		}
		const { error } = await supabase_full_access.auth.admin.deleteUser(session.user.id);
		if (error) {
			throw error;
		}
		redirect(303, '/confirmations/account-deleted');
	}
};
