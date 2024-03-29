import { convertToSnakeCaseEnhanced } from '$lib/generic-helpers';
import type { MysterySubmitSchema } from '../../routes/(navbar_only)/user/mysteries/[slug]/schema';
import { USER_APPEND_TEXT } from '../../routes/api/ask/consts';
import { supabase_full_access } from './supabase_full_access.server';

export interface suspect {
	name: string;
	description: string;
}
export async function loadSuspects(slug: string) {
	const { data, error } = await supabase_full_access
		.from('mysteries')
		.select('suspects(name, description)')
		.eq('slug', slug)
		.limit(1)
		.single();
	if (error) {
		console.error(error);
		return error;
	}
	return data.suspects;
}

export async function loadVictim(slug: string) {
	const { data, error } = await supabase_full_access
		.from('mysteries')
		.select('victim_name, victim_description')
		.eq('slug', slug)
		.limit(1)
		.single();
	if (error) {
		return error;
	}
	return data;
}

export async function loadGameInfo(slug: string) {
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
		.eq('slug', slug)
		.limit(1)
		.single();

	if (conversationError) {
		console.error('conversation error: ', conversationError);
		return conversationError;
	}

	return conversationData;
}

export async function loadMysteryLetterInfo(slug: string) {
	const { data: mysteryData, error: mysteryError } = await supabase_full_access
		.from('mysteries')
		.select('letter_info, access_code, order_int, name')
		.eq('slug', slug)
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

export async function loadMysteries() {
	const { data, error } = await supabase_full_access.from('mysteries').select('*').order('order_int', { ascending: true });
	if (error) {
		console.error(error);
		return error;
	}
	return data;
}

export async function loadUserMysteries(userId: string) {
	const { data, error } = await supabase_full_access
		.from('user_mysteries')
		.select('id, info->mystery->>name, mystery_id')
		.eq('user_id', userId);
	if (error) {
		console.error('error loading user mysteries', error);
		return error;
	}
	console.log('data: ', data);
	return data ? data : [];
}

export async function saveMystery(uuid: string, userid: string, json: any, images: { image: File; path: string }[]) {
	const { error } = await supabase_full_access
		.from('user_mysteries')
		.update({ id: uuid, user_id: userid, info: json })
		.eq('id', uuid)
		.select('id')
		.single();
	if (error) {
		console.error('error saving mystery', error);
		return error;
	}

	const inserts = images.map(async (imageAndFile) =>
		supabase_full_access.storage
			.from('user_mysteries')
			.upload(uuid + '/' + imageAndFile.path, await imageAndFile.image.arrayBuffer(), { upsert: true })
	);

	const uploads = await Promise.all(inserts);
	console.log('uploads: ', uploads);
	if (uploads.some((upload) => upload.error)) {
		console.error('error uploading mystery images', uploads);
		return uploads.find((upload) => upload.error)?.error;
	}
	return true;
}

export async function createNewUserMystery(userid: string) {
	const { data: mysteryInsert, error: mysteryInsertError } = await supabase_full_access
		.from('user_mysteries')
		.insert({ user_id: userid, info: '{}' })
		.select('id, info')
		.single();
	if (mysteryInsertError) {
		console.error(mysteryInsertError);
		return mysteryInsertError;
	}
	return mysteryInsert;
}

export async function loadyMystery(slug: string, userid: string) {
	const { data, error } = await supabase_full_access
		.from('user_mysteries')
		.select('info, id')
		.eq('user_id', userid)
		.eq('id', slug)
		.limit(1);
	if (error) {
		console.error(error);
		return error;
	}
	if (!data || data.length == 0) {
		throw new Error('No mystery found');
	}
	return data[0];
}

export async function deleteMystery(id: string, userid: string) {
	const { error } = await supabase_full_access.from('user_mysteries').delete().eq('user_id', userid).eq('id', id);
	if (error) {
		console.error(error);
		return error;
	}
	return true;
}

export async function loadMysteryWithOrder1() {
	const { data, error } = await supabase_full_access.from('mysteries').select('slug').eq('order_int', 1);
	if (error) {
		console.error(error);
		return error;
	}
	if (data && data.length > 0) {
		return data[0].slug;
	}
	throw new Error('no mystery found with order_int 1');
}

export async function publishMysteryForAll(mysteryData: MysterySubmitSchema, userId: string) {
	const { data: userData, error: userError } = await supabase_full_access
		.from('user_mysteries')
		.select('id, mystery_id')
		.eq('id', mysteryData.id)
		.eq('user_id', userId)
		.single();
	if (userError) return userError;
	if (!userData) return false;
	const refactoredMystery = {
		name: mysteryData.mystery.name,
		description: mysteryData.mystery.description,
		setting: mysteryData.mystery.setting,
		theme: mysteryData.mystery.theme,
		letter_info: mysteryData.mystery.letter_info,
		letter_prompt: mysteryData.mystery.letter_info,
		accuse_letter_prompt: mysteryData.mystery.letter_info,
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
		},
		slug: mysteryData.id
	};

	let mysteryId: number;
	if (userData.mystery_id) {
		const { data, error } = await supabase_full_access
			.from('mysteries')
			.update(refactoredMystery)
			.eq('id', userData.mystery_id)
			.eq('access_code', 'user')
			.select('id')
			.single();
		if (error) return error;
		mysteryId = data.id;
	} else {
		const { data, error } = await supabase_full_access.from('mysteries').insert(refactoredMystery).select('id').single();
		if (error) return error;
		const { error: updateError } = await supabase_full_access
			.from('user_mysteries')
			.update({ mystery_id: data.id })
			.eq('id', mysteryData.id)
			.eq('user_id', userId);
		if (updateError) return updateError;
		mysteryId = data.id;
	}

	const [{ error: deleteTimeframes }, { error: deleteSuspects }, { error: deleteFewShots }, { error: deleteActionClues }] =
		await Promise.all([
			supabase_full_access.from('timeframes').delete().eq('mystery_id', mysteryId),
			supabase_full_access.from('suspects').delete().eq('mystery_id', mysteryId),
			supabase_full_access.from('few_shots').delete().eq('mystery_id', mysteryId),
			supabase_full_access.from('action_clues').delete().eq('mystery_id', mysteryId)
		]);
	if (deleteTimeframes || deleteSuspects || deleteFewShots || deleteActionClues) {
		return deleteTimeframes || deleteSuspects || deleteFewShots || deleteActionClues;
	}

	const insertOperations = [
		supabase_full_access.from('timeframes').insert(mysteryData.timeframes.map((event) => ({ ...event, mystery_id: mysteryId }))),
		supabase_full_access.from('suspects').insert(
			mysteryData.suspects.map((suspect, i) => ({
				name: suspect.name,
				description: suspect.description,
				mystery_id: mysteryId
			}))
		),
		supabase_full_access.from('action_clues').insert(mysteryData.action_clues.map((clue) => ({ ...clue, mystery_id: mysteryId })))
	];

	const few_shots = mysteryData.few_shots_known_answers
		.flatMap((shot) => [
			{
				role: 'user',
				content: shot.question + '\n' + USER_APPEND_TEXT
			},
			{
				role: 'assistant',
				content:
					'Sherlock has ordered me to ' +
					shot.question +
					'Was I provided some kind of information about this?\nYes\nInformation:\n- ' +
					shot.answer
			}
		])
		.concat(
			mysteryData.few_shots_unknown_answers.flatMap((shot) => [
				{
					role: 'user',
					content: shot.question + '\n' + USER_APPEND_TEXT
				},
				{
					role: 'assistant',
					content:
						'Sherlock has ordered me to ' +
						shot.question +
						'Was I provided some kind of information about this?\nNo\nInformation:\n- ' +
						shot.answer
				}
			])
		);

	if (mysteryData.few_shots_known_answers) {
		insertOperations.push(supabase_full_access.from('few_shots').insert({ mystery_id: mysteryId, brain: { messages: few_shots } }));
	}

	const results = await Promise.all(insertOperations);

	// Extract errors from the results if necessary
	if (results.some((result) => result.error != null)) {
		return results.find((result) => result.error != null);
	}

	const { data: list, error: listError } = await supabase_full_access.storage.from('user_mysteries').list(`${mysteryData.id}/published`);
	const filesToRemove = list.map((x) => `${mysteryData.id}/published/${x.name}`);
	console.log('filesToRemove: ', filesToRemove);
	const { data: deleteData, error: deleteError } = await supabase_full_access.storage.from('user_mysteries').remove(filesToRemove);
	console.log('deleteData: ', deleteData);
	console.log('deleteError: ', deleteError);

	const insertImages = [
		supabase_full_access.storage
			.from('user_mysteries')
			.copy(
				mysteryData.id + '/' + mysteryData.mystery.image,
				mysteryData.id + '/published/' + convertToSnakeCaseEnhanced(mysteryData.mystery.name)
			),
		supabase_full_access.storage
			.from('user_mysteries')
			.copy(
				mysteryData.id + '/' + mysteryData.mystery.victim_image,
				mysteryData.id + '/published/' + convertToSnakeCaseEnhanced(mysteryData.mystery.victim_name)
			)
	];
	insertImages.concat(
		mysteryData.suspects.map((s) =>
			supabase_full_access.storage
				.from('user_mysteries')
				.copy(mysteryData.id + '/' + s.image, mysteryData.id + '/published/' + convertToSnakeCaseEnhanced(s.name))
		)
	);
	const imageeInsertResults = await Promise.all(insertImages);
	return imageeInsertResults.find((r) => r.error != null) || true;
}
