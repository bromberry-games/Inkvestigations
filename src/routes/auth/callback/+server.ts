import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next');
	if (code) {
		await (supabase as SupabaseClient).auth.exchangeCodeForSession(code);
		if (next) {
			redirect(303, next);
		}
	}

	redirect(303, '/');
};
