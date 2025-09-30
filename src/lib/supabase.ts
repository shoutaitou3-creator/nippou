import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (import.meta.env.DEV) {
  console.log('Supabase設定確認:');
  console.log('URL:', supabaseUrl ? '設定済み' : '未設定');
  console.log('Anon Key:', supabaseAnonKey ? '設定済み' : '未設定');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);