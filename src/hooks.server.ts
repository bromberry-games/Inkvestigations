import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../schema';
import { createServerClient } from '@supabase/ssr';

export const handle: Handle = async ({ event, resolve }) => {
	// event.locals.supabase = createSupabaseServerClient<Database>({
	// supabaseUrl: PUBLIC_SUPABASE_URL,
	// supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
	// event
	// });
	event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, options);
			},
			remove: (key, options) => {
				event.cookies.delete(key, options);
			}
		}
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
