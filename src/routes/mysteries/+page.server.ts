
export const load = async ({ locals: { getSession, supabase } }) => {
    const session = await getSession()
    let mysteries;
    if (session) {
      const { data } = await supabase.from("mysteries").select('*, solved(solved)');
      mysteries = data;
    } else {
      const { data } = await supabase.from("mysteries").select();
      mysteries = data
    }

    return {
      mysteries: mysteries ?? [],
    }
}
