import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';
import { loadMysteryLetterInfo, loadSuspects, loadVictim } from '$lib/supabase/mystery_data.server';
import { archiveLastConversation, loadEventMessages, loadLetterMessagesNotesAndConversationId } from '$lib/supabase/conversations.server';
import { shuffleArray } from '$lib/generic-helpers';
import { isPostgresError, isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import { throwIfFalse } from '$misc/error';
import { loadActiveAndUncancelledSubscription } from '$lib/supabase/prcing.server';
import { MAX_CONVERSATION_LENGTH } from '$lib/message-conversation-lengths';

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

			To familiarize yourself with the people involved in this case, I have attached their pictures in the lower left corner. When you are certain you know who it was, you can solve it by changing the input command to "solve" and make your case there. But be careful: to solve this mystery, your deduction must have the following:

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
	const [letterInfo, messagesAndNotes, suspects, eventMessages, activeSub, victim] = await Promise.all([
		loadMysteryLetterInfo(session.user.id, mysteryName),
		loadLetterMessagesNotesAndConversationId(session.user.id, mysteryName),
		loadSuspects(mysteryName),
		loadEventMessages(mysteryName),
		loadActiveAndUncancelledSubscription(session.user.id),
		loadVictim(mysteryName)
	]);
	isTAndThrowPostgresErrorIfNot(letterInfo);
	isTAndThrowPostgresErrorIfNot(messagesAndNotes);
	isTAndThrowPostgresErrorIfNot(eventMessages);
	isTAndThrowPostgresErrorIfNot(activeSub);
	isTAndThrowPostgresErrorIfNot(victim);
	isTAndThrowPostgresErrorIfNot(suspects);
	if (letterInfo.access_code != 'free') {
		if (activeSub[0]?.access_codes == null || activeSub.length == 0) {
			redirect(303, '/mysteries');
		} else if (!activeSub[0].access_codes.split(',').includes(letterInfo.access_code)) {
			redirect(303, '/mysteries');
		}
	}
	eventMessages.push({
		letter: `Dear Sherlock,
		
		the time has come to solve this mystery. I can not investigate any further. Please solve the case now.
		
		William Wellington,

		Police chief of Zlockinbury
		`,
		show_at_message: MAX_CONVERSATION_LENGTH
	});

	return {
		slug,
		messages: [createLetter(letterInfo.letter_info), ...messagesAndNotes.messages],
		suspects: [
			{
				name: victim.victim_name,
				description: victim.victim_description
			},
			...suspects.sort((a, b) => a.name.localeCompare(b.name))
		],
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
	}
};
