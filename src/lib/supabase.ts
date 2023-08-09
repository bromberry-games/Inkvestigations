import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schema'
import { SUPABASE_KEY, SUPABASE_PROJECT_URL } from '$env/static/private'

export const supabase = createClient<Database>(SUPABASE_PROJECT_URL, SUPABASE_KEY);