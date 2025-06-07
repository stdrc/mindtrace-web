import { createClient } from '@supabase/supabase-js';
// Will add proper types later
// import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Temporarily remove the generic type to make development easier
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 