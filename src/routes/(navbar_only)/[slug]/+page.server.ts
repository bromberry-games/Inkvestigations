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
		content: `${letterInfo}`
	};
}

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session: Session = await getSession();
	if (!session) {
		redirect(303, '/');
	}
	const { slug } = params;
	// const mysteryName = slug.replace(/_/g, ' ');

	//TODO: Function or view?
	const [letterInfo, messagesAndNotes, suspects, eventMessages, activeSub, victim] = await Promise.all([
		loadMysteryLetterInfo(slug),
		loadLetterMessagesNotesAndConversationId(session.user.id, slug),
		loadSuspects(slug),
		loadEventMessages(slug),
		loadActiveAndUncancelledSubscription(session.user.id),
		loadVictim(slug)
	]);
	isTAndThrowPostgresErrorIfNot(letterInfo);
	isTAndThrowPostgresErrorIfNot(messagesAndNotes);
	isTAndThrowPostgresErrorIfNot(eventMessages);
	isTAndThrowPostgresErrorIfNot(activeSub);
	isTAndThrowPostgresErrorIfNot(victim);
	isTAndThrowPostgresErrorIfNot(suspects);
	if (letterInfo.access_code != 'free' && letterInfo.access_code != 'user') {
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
		show_at_message: MAX_CONVERSATION_LENGTH,
		mysteries: {
			slug: slug
		}
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
		convId: messagesAndNotes.conversationId,
		orderInt: letterInfo.order_int
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
