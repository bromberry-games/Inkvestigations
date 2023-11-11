import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase, getSession } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next');
	const session = await getSession();
	console.log('hit');
	if (code) {
		if (session) console.log(session.user.id);
		console.log('code:', code);
		await supabase.auth.exchangeCodeForSession(code);
		if (next) {
			console.log('redirecting to:', next);
			throw redirect(303, next);
		}
	}

	throw redirect(303, '/');
};
