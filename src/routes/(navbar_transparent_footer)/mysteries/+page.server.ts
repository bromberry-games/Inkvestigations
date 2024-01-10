import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers.js';
import { loadMysteriesWithSolved } from '$lib/supabase/mystery_data.server';

export const load = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	let mysteries;
	if (session) {
		const data = await loadMysteriesWithSolved(session.user.id);
		isTAndThrowPostgresErrorIfNot(data);
		mysteries = data;
	} else {
		const { data } = await supabase.from('mysteries').select();
		mysteries = data;
	}

	return {
		mysteries: mysteries ?? []
	};
};
