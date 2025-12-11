
import { createClient } from '@supabase/supabase-js';

// 使用 Vite 的环境变量 import.meta.env
// 本地开发时读取 .env 文件
// 部署到 Netlify 时读取 Netlify Build Settings 中的环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
