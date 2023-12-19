import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { loadMysteryLetterInfo, loadSuspects } from '$lib/supabase/mystery_data.server';
import { loadLetterMessages } from '$lib/supabase/conversations.server';
import { shuffleArray } from '$lib/generic-helpers';
import { isPostgresError } from '$lib/supabase/helpers';

function createLetter(letterInfo: string) {
	return {
		role: 'assistant',
		content: `
			Dear Mr. Holmes,

			I'm sorry to have to write under these circumstances.
			${letterInfo}
			I will follow your orders to the best of my ability. Some things you can ask of me are:

			- Inspect
			- Question
			- Search
			- Analyze

			To familiarize yourself with the people involved in this case, I have attached their pictures to the left of your input text box. When you are certain you know who it was, select their picture from among the suspects and write your deduction. To solve this mystery, your deduction must have the following:

			- Motive
			- Opportunity
			- Evidence

			I hope you can help me with this case.

			William Wellington,

			Police chief of Zlockinbury
		`
	};
}

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		redirect(303, '/');
	}
	const { slug } = params;
	const mysteryName = slug.replace(/_/g, ' ');

	const [letterInfo, messages, suspects] = await Promise.all([
		loadMysteryLetterInfo(session.user.id, mysteryName),
		loadLetterMessages(session.user.id, mysteryName),
		loadSuspects(mysteryName)
	]);
	if (!letterInfo) {
		error(500, 'could not load letter info from data');
	}
	if (isPostgresError(messages)) {
		error(500, messages);
	}
	if (!suspects) {
		error(500, 'could not load suspects chat from data');
	}
	return { slug, messages: [createLetter(letterInfo), ...messages], suspects: shuffleArray(suspects) };
};
