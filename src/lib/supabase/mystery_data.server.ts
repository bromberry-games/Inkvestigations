import { supabase_full_access } from './supabase_full_access.server';

export interface suspect {
	name: string;
	description: string;
}
export async function loadSuspects(mysterName: string) {
	const { data, error } = await supabase_full_access
		.from('mysteries')
		.select('suspects(name, description)')
		.eq('name', mysterName)
		.limit(1)
		.single();
	if (error) {
		console.error(error);
		return error;
	}
	return data.suspects;
}

export async function loadVictim(mysterName: string) {
	const { data, error } = await supabase_full_access
		.from('mysteries')
		.select('victim_name, victim_description')
		.eq('name', mysterName)
		.limit(1)
		.single();
	if (error) {
		return error;
	}
	return data;
}

export async function loadGameInfo(mystery: string, messageLength: number) {
	const { data: conversationData, error: conversationError } = await supabase_full_access
		.from('mysteries')
		.select(
			`theme, setting, letter_prompt, accuse_letter_prompt, solution, victim_name, victim_description, star_ratings, 
			suspects(name, description), 
			action_clues(action, clue),
			timeframes(timeframe, event_happened),
			events(letter, info, show_at_message, timeframe),
			few_shots(brain, accuse_brain)
			`
		)
		.eq('name', mystery)
		.lte('events.show_at_message', messageLength)
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ', conversationError);
		return conversationError;
	}

	return conversationData;
}

export async function loadMysteryLetterInfo(mystery: string) {
	const { data: mysteryData, error: mysteryError } = await supabase_full_access
		.from('mysteries')
		.select('letter_info, access_code, order_int')
		.eq('name', mystery)
		.single();

	if (mysteryError) {
		console.error('error querying mystery: ', mysteryError);
		return mysteryError;
	}

	return mysteryData;
}

export async function loadMysteriesWithSolved(userId: string) {
	const { error, data } = await supabase_full_access
		.from('mysteries')
		.select('*, solved(rating)')
		.eq('solved.user_id', userId)
		.order('order_int', { ascending: true });
	if (error) {
		console.error(error);
		return error;
	}
	return data;
}
