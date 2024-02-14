// src/routes/+layout.ts
import { invalidate } from '$app/navigation';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../schema.js';
import { combineChunks, createBrowserClient, isBrowser, parse } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}

				const cookie = combineChunks(key, (name) => {
					const cookies = parse(document.cookie);
					return cookies[name];
				});
				return cookie;
			}
		}
	});
	// const supabase = createSupabaseLoadClient<Database>({
	// supabaseUrl: PUBLIC_SUPABASE_URL,
	// supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
	// event: { fetch },
	// serverSession: data.session
	// });

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
