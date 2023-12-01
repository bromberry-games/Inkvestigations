import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { loadMysteryLetterInfo, loadSuspects } from '$lib/supabase/mystery_data.server';
import { loadDisplayMessages } from '$lib/supabase/conversations.server';
import { shuffleArray } from '$lib/generic-helpers';

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
		throw redirect(303, '/');
	}
	const { slug } = params;
	const mysteryName = slug.replace(/_/g, ' ');

	const [letterInfo, messages, suspects] = await Promise.all([
		loadMysteryLetterInfo(session.user.id, mysteryName),
		loadDisplayMessages(session.user.id, mysteryName),
		loadSuspects(mysteryName)
	]);
	//const letterInfo = await loadMysteryLetterInfo(session.user.id, mysteryName);
	if (!letterInfo) {
		throw error(500, 'could not load letter info from data');
	}
	//const messages = await loadDisplayMessages(session.user.id, mysteryName);
	if (!messages) {
		throw error(500, 'could not load chat from data');
	}
	//const suspects = await loadSuspects(mysteryName);
	if (!suspects) {
		throw error(500, 'could not load suspects chat from data');
	}
	return { messages: [createLetter(letterInfo), ...messages], suspects: shuffleArray(suspects) };
};
