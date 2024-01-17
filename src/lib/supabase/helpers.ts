import type { PostgrestError } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export function isPostgresError<T>(error: PostgrestError | T): error is PostgrestError {
	// This (of course) only checks if a code property exists on the object. Should be fine.
	return (error as PostgrestError).code !== undefined;
}

export function isTAndThrowPostgresErrorIfNot<T>(value: PostgrestError | T): asserts value is T {
	if (isPostgresError(value)) {
		error(500, value.message);
	}
}
