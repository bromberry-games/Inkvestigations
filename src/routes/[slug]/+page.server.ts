import { redirect } from "@sveltejs/kit";
import type { PageLoad, PageServerLoad } from "./$types";
import type { Session } from "@supabase/supabase-js";
import { addConversationForUser, addMessageForUser } from "$lib/supabase_full";

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
    const session: Session = await getSession()

    if (!session) {
      throw redirect(303, '/')
    }

    const { slug } = params;

    addConversationForUser(session.user.id, slug);
}
