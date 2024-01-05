import type { PostgrestError } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export function isPostgresError<T>(error: PostgrestError | T): error is PostgrestError {
	return (error as PostgrestError).code !== undefined;
}

export function isTAndThrowPostgresErrorIfNot<T>(value: PostgrestError | T): asserts value is T {
	if (isPostgresError(value)) {
		error(500, value.message);
	}
}
