import type { UserResponse } from '@supabase/supabase-js';
import { supabase_full_access } from './supabase_full_access.server';
import { supabase } from '@supabase/auth-ui-shared';

function generateRandomString(length: number) {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
		.join('')
		.substring(0, length);
}

export async function createTemporaryUser() {
	const mail = generateRandomString(32) + '@bromberry.xyz';
	const password = generateRandomString(64);

	const user = await supabase_full_access.auth.admin.createUser({
		email: mail,
		password: password,
		email_confirm: true,
		user_metadata: {
			anonymous: true
		}
	});

	return {
		mail,
		password
	};
}

export async function migrateAnoynmousUserToNewUser(newUserId: string, oldUserId: string): Promise<boolean> {
	const { data: userData, error: userError } = await supabase_full_access.auth.admin.getUserById(oldUserId);
	if (userError) {
		console.error(userError);
		return false;
	}
	if (userData.user?.user_metadata.anonymous) {
		const { error } = await supabase_full_access.from('user_mystery_conversations').update({ user_id: newUserId }).eq('user_id', oldUserId);
		if (error) {
			console.error(error);
			return false;
		}
		const { error: deleteUserError } = await supabase_full_access.auth.admin.deleteUser(oldUserId);
		if (deleteUserError) {
			console.error(deleteUserError);
			return false;
		}
	} else {
		return false;
	}
	return true;
}
