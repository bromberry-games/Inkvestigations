import { migrateAnoynmousUserToNewUser } from '$lib/supabase/temporary_users.server.js';
import type { AuthTokenResponse } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next');
	console.log('hit');
	if (code) {
		console.log('code:', code);
		const result: AuthTokenResponse = await supabase.auth.exchangeCodeForSession(code);
		const oldUser = result.data.user?.user_metadata.old_user_id;
		if (result.data.user && oldUser != '') {
			const res = await migrateAnoynmousUserToNewUser(result.data.user.id, oldUser);
		}
		//await
		if (next) {
			console.log('redirecting to:', next);
			throw redirect(303, next);
		}
	}

	throw redirect(303, '/');
};
