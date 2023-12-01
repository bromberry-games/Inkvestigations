import type { PostgrestError } from '@supabase/supabase-js';

export function isPostgresError<T>(error: PostgrestError | T): error is PostgrestError {
	return (error as PostgrestError).code !== undefined;
}
