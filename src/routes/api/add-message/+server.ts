import { addMessageForUser } from "$lib/supabase_full";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: {getSession, supabase} }) => {
	const session = await getSession();
	if (!session) {
		throw error(500, 'You are not logged in.');
	}
    const { message, mystery} = await request.json();

    session.user_id
    console.log(message);
    addMessageForUser(session.user_id, message, mystery);

    return json({ status: 201 });
};
