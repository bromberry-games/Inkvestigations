import { supabase_full_access } from './supabase_full_access.server';

export interface suspect {
	name: string;
	imagepath: string;
	description: string;
}
export async function loadSuspects(mysterName: string): Promise<suspect[] | null> {
	const { data, error } = await supabase_full_access
		.from('mysteries')
		.select('suspects, murderer')
		.eq('name', mysterName)
		.limit(1)
		.single();
	if (error) {
		console.error(error);
		return null;
	}
	return [
		...data.suspects,
		{
			name: data.murderer.name,
			imagepath: data.murderer.imagepath,
			description: data.murderer.description
		}
	];
}

export async function loadGameInfo(mystery: string, messageLength: number) {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('mysteries')
		.select(
			'theme, setting, timeframe, action_clues, letter_prompt, accuse_letter_prompt, suspects, murderer, victim_name, victim_description, events(letter, info, show_at_message)'
		)
		.eq('name', mystery)
		.lte('events.show_at_message', messageLength)
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ', conversationError);
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
