import { addMessageForUser } from "$lib/supabase_full";
import type { Session } from "@supabase/supabase-js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: {getSession, supabase} }) => {
	const session: Session = await getSession();
	if (!session) {
		throw error(500, 'You are not logged in.');
	}
    const { message, mystery }: { message: string; mystery: string } = await request.json();

    console.log(message);
    
    addMessageForUser(session.user.id, message, mystery.replace(/_/g, ' '));

    return json({ status: 201 });
};
