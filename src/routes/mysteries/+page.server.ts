import { archiveLastConversation } from "$lib/supabase_full.server";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ locals: { getSession, supabase } }) => {
    const session = await getSession()
    let mysteries;
    if (session) {
      const { data } = await supabase.from("mysteries").select('*, solved(rating)');
      mysteries = data;
    } else {
      const { data } = await supabase.from("mysteries").select();
      mysteries = data
    }

    return {
      mysteries: mysteries ?? [],
    }
}

export const actions = {
  deleteChat: async ({request, locals: { getSession }}) => {
    const session: Session = await getSession()
    if (!session) {
      throw redirect(303, '/')
    }
    const formData = await request.formData();
    const slug = formData.get('slug')?.toString();
    if(!slug) {
      throw error(500, 'Could not find mystery name')
    }
    archiveLastConversation(session.user.id, slug)
    throw redirect(302, '/' + slug.replace(/ /g, '_'))
  },
}
