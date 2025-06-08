import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase config:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl?.substring(0, 20) + '...' // 只显示前20个字符用于调试
  });
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase client initialized with URL:', supabaseUrl?.substring(0, 30) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 