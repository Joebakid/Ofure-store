import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env variables missing", {
    supabaseUrl,
    supabaseAnonKey,
  });
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,       // ✅ REQUIRED
      autoRefreshToken: true,     // ✅ REQUIRED
      detectSessionInUrl: true,   // ✅ REQUIRED
    },
  }
);
