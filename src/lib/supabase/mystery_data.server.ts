import { supabase_full_access } from './supabase_full_access.server';

export interface suspects {
	name: string;
	imagepath: string;
}
export async function loadSuspects(mysterName: string): Promise<suspects[] | null> {
	const { data, error } = await supabase_full_access.from('suspects').select('name, imagepath').eq('mystery_name', mysterName);
	if (error) {
		console.error(error);
		return null;
	}
	return data;
}

export async function loadGameInfo(
	mystery: string
): Promise<{ brain_prompt: string; letter_prompt: string; accuse_prompt: string; accuse_letter_prompt: string } | null> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('mysteries')
		.select('brain_prompt, letter_prompt, accuse_prompt, accuse_letter_prompt')
		.eq('name', mystery)
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ');
		console.error(conversationError);
		return null;
	}

	return conversationData;
}

export async function loadMysteryLetterInfo(userid: string, mystery: string): Promise<string | null> {
	const { data: mysteryData, error: mysteryError } = await supabase_full_access
		.from('mysteries')
		.select('letter_info')
		.eq('name', mystery)
		.single();

	if (mysteryError) {
		console.error('error querying mystery: ', mysteryError);
		return null;
	}

	return mysteryData.letter_info;
}

export async function loadMysteries(userId: string) {
	const { data, error } = await supabase_full_access.from('user_mysteries').select('name, published').eq('user_id', userId);
	if (error) {
		console.error(error);
		return null;
	}
	return data ? data : [];
}

export async function saveMystery(uuid: string, mysteryName: string, userid: string, json: string): Promise<boolean> {
	const { error } = await supabase_full_access
		.from('user_mysteries')
		.upsert({ id: uuid, user_id: userid, name: mysteryName, info: json }, { onConflict: 'id' });
	if (error) {
		console.error('error saving mystery', error);
		return false;
	}
	return true;
}

export async function loadyMystery(name: string, userid: string) {
	const { data, error } = await supabase_full_access
		.from('user_mysteries')
		.select('name, info, id')
		.eq('user_id', userid)
		.eq('name', name)
		.limit(1);
	if (error) {
		console.error(error);
		return null;
	}
	return data && data.length > 0 ? data[0] : { name: '', info: '' };
}

export async function publishMystery(mystery: string, userid: string): Promise<boolean> {
	const { error } = await supabase_full_access.from('user_mysteries').update({ published: true }).eq('user_id', userid).eq('name', mystery);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}

export async function deleteMystery(mystery: string, userid: string): Promise<boolean> {
	const { error } = await supabase_full_access.from('user_mysteries').delete().eq('user_id', userid).eq('name', mystery);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
}
