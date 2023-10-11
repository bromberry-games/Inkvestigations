
export const load = async ({ locals: { getSession, supabase } }) => {
    const { data } = await supabase.from("mysteries").select();
    const session = await getSession()
    let userMessages = 0;
    if (session) {
      const { data } = await supabase.from("user_messages").select().limit(1).single();
      userMessages = data.amount
    }

    return {
      mysteries: data ?? [],
      amount: userMessages
    }

}
