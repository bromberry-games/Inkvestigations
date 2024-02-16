import type { MysterySubmitSchema } from '../../routes/(navbar_only)/user/mysteries/[slug]/schema';
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

export async function loadGameInfo(mystery: string) {
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
		// .lte('events.show_at_message', messageLength)
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
		.upsert({ id: uuid, user_id: userid, name: mysteryName, info: json }, { onConflict: 'id' })
		.eq('user_id', userid);
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

export async function publishMysteryForAll(mysteryData: MysterySubmitSchema) {
	const { error } = await supabase_full_access.from('mysteries').upsert(
		{
			name: mysteryData.mystery.name,
			description: mysteryData.mystery.description,
			setting: mysteryData.mystery.setting,
			theme: mysteryData.mystery.theme,
			letter_info: mysteryData.mystery.letter_info,
			letter_prompt: '',
			accuse_letter_prompt: '',
			victim_name: mysteryData.mystery.victim_name,
			victim_description: mysteryData.mystery.victim_description,
			solution: mysteryData.mystery.solution,
			access_code: 'user',
			star_ratings: {
				star0:
					'Angela Videl publishes a sincere and heartfelt farewell to her colleague. Some frustration about the failure of the investigators is visible.',
				star1:
					'Oliver is arrested though he protests it. Everyone is divided between complete disbelief and not being surprised at all. Maria Payton comments that it is old wisdom that the biggest love may lead to the strongest anger.',
				star2:
					'Oliver breaks down under the accusation. He falls to the ground admitting his crime. But he shouts that if Terry had shown any kind of regret he would have forgiven him.',
				star3:
					'All heads shoot to Oliver. Blanched and shaking he tries to move backwards but his back is against the wall. He slides down and admits it, head in his hands. Terry misused his influence, showing no regard for the people that were affected. Since becoming his apprentice, he had witnessed how Terry literally made up articles out of thin air, and the results always somehow helped Terry. Oliver looked Wellington in the eyes and says that he would do it again.'
			}
		},
		{ onConflict: 'name' }
	);
	console.log('error publishing mystery', error);
	return error || true;
}
