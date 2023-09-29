import { addConversationForUser, addMessageForUser } from "$lib/supabase_full";
import type { Session } from "@supabase/supabase-js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: {getSession, supabase} }) => {
	const session: Session = await getSession();
	if (!session) {
		throw error(500, 'You are not logged in.');
	}
    const { mystery } = await request.json();

    addConversationForUser(session.user.id, mystery);

    return json({ status: 201 });
};
