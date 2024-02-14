import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers.js';
import { loadMysteriesWithSolved } from '$lib/supabase/mystery_data.server';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server';

export const load = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (session) {
		const [data, subStatus] = await Promise.all([
			loadMysteriesWithSolved(session.user.id),
			loadActiveAndUncancelledSubscription(session.user.id)
		]);

		isTAndThrowPostgresErrorIfNot(data);
		isTAndThrowPostgresErrorIfNot(subStatus);
		return {
			mysteries: data,
			userAccessCodes: subStatus?.[0]?.access_codes ?? ''
		};
	} else {
		const { data } = await supabase.from('mysteries').select();
		return {
			mysteries: data
		};
	}
};
