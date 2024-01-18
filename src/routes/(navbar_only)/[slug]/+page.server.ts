import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { loadMysteryLetterInfo, loadSuspects } from '$lib/supabase/mystery_data.server';
import { archiveLastConversation, loadEventMessages, loadLetterMessagesNotesAndConversationId } from '$lib/supabase/conversations.server';
import { shuffleArray } from '$lib/generic-helpers';
import { isPostgresError, isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import { throwIfFalse } from '$misc/error';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server';

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

	//TODO: Function or view?
	const [letterInfo, messagesAndNotes, suspects, eventMessages, activeSub] = await Promise.all([
		loadMysteryLetterInfo(session.user.id, mysteryName),
		loadLetterMessagesNotesAndConversationId(session.user.id, mysteryName),
		loadSuspects(mysteryName),
		loadEventMessages(mysteryName),
		loadActiveAndUncancelledSubscription(session.user.id)
	]);
	isTAndThrowPostgresErrorIfNot(letterInfo);
	isTAndThrowPostgresErrorIfNot(messagesAndNotes);
	isTAndThrowPostgresErrorIfNot(eventMessages);
	isTAndThrowPostgresErrorIfNot(activeSub);
	if (!suspects) {
		error(500, 'could not load suspects chat from data');
	}
	if (letterInfo.access_code != 'free') {
		if (activeSub[0]?.access_codes == null || activeSub.length == 0) {
			redirect(303, '/mysteries');
		} else if (!activeSub[0].access_codes.split(',').includes(letterInfo.access_code)) {
			redirect(303, '/mysteries');
		}
	}

	return {
		slug,
		messages: [createLetter(letterInfo.letter_info), ...messagesAndNotes.messages],
		suspects: suspects.sort((a, b) => a.name.localeCompare(b.name)),
		eventMessages,
		metered: activeSub.length == 1 && activeSub[0].products.some((p) => p.metered_si != null),
		notes: messagesAndNotes.notes?.[0]?.notes || {},
		convId: messagesAndNotes.conversationId
	};
};

export const actions = {
	archiveChat: async ({ params, locals: { getSession } }) => {
		const session: Session = await getSession();
		if (!session) {
			redirect(303, '/');
		}
		const { slug } = params;
		const convoArchived = await archiveLastConversation(session.user.id, slug.replace(/_/g, ' '));
		throwIfFalse(convoArchived, 'Could not archive conversation');
		redirect(302, '/' + slug);
	},
	saveNotes: async ({ request, params, locals: { getSession } }) => {
		const session: Session = await getSession();
		if (!session) {
			redirect(303, '/');
		}
		const { slug } = params;
		const notes = form.data.notes;
		const notesSaved = await saveNotes(session.user.id, slug.replace(/_/g, ' '), notes);
	}
};
