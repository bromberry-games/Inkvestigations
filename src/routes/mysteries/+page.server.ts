import { supabase } from "$lib/supabase";


export async function load() {
    const { data } = await supabase.from("mysteries").select();
    return {
      mysteries: data ?? [],
    };
}