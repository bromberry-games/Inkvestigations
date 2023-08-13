import { supabase as db} from "$lib/supabase";


export const load = async ({ locals: { getSession, supabase } }) => {
    const { data } = await db.from("mysteries_view").select();
    const session = await getSession()
    let userMessages = 0;
    if (session) {
      const { data }= await supabase.from("user_messages").select().limit(1).single();
      console.log(data)
      userMessages = data.amount
    }


    return {
      mysteries: data ?? [],
      amount: userMessages
    }
}

//export async function load({locals: { getSession, supabase }}) {
//    const { data } = await db.from("mysteries").select();
//    const session = await getSession()
//    let userMessages = 0;
//    if (session) {
//      userMessages = await supabase.from("user_messages").select();
//    }
//
//
//    return {
//      mysteries: data ?? [],
//    };
//}