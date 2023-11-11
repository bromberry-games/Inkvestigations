import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/schema';

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
export const supabase_full_access = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
