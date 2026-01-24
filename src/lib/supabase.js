import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔴 SAFETY CHECK
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env variables missing");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
