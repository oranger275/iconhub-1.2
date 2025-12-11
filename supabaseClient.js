
import { createClient } from '@supabase/supabase-js';

// ⚠️ 在生产环境中，建议将这些变量放入 .env 文件 (import.meta.env.VITE_SUPABASE_URL)
const supabaseUrl = 'https://acamsigpoolurjjgvywm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW1zaWdwb29sdXJqamd2eXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY1ODcsImV4cCI6MjA4MDkwMjU4N30.RCqzQBIb2J99VwI2o2r0yvoy4H9wh63alm_p39CwoJA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
