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

export async function loadGameInfo(mystery: string): Promise<string | null> {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('mysteries')
		.select('game_info')
		.eq('name', mystery)
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ');
		console.error(conversationError);
		return null;
	}

	return conversationData?.game_info;
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
