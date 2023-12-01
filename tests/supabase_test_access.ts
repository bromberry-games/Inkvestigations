import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/schema';
import 'dotenv/config';

const SUPABASE_SERVICE_KEY = process.env.ENV_TO_TEST == 'DEV' ? process.env.SUPABASE_DEV_SERVICE_KEY : process.env.SUPABASE_SERVICE_KEY;
const PUBLIC_SUPABASE_URL = process.env.ENV_TO_TEST == 'DEV' ? process.env.SUPBASE_DEV_URL : process.env.PUBLIC_SUPABASE_URL;
if (!SUPABASE_SERVICE_KEY || !PUBLIC_SUPABASE_URL) {
	throw new Error('Missing SUPABASE_SERVICE_KEY or PUBLIC_SUPABASE_URL');
}
export const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
