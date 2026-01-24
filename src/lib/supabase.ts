import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "").trim();

  if (!url || !key) {
    throw new Error("Supabase: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) nas variáveis de ambiente da Vercel.");
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
