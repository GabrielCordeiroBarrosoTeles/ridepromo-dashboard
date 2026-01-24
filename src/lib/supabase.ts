import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createSupabaseClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const url = rawUrl.replace(/\/+$/, ""); // remove trailing slash
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!url || !key) {
    const missing = [];
    if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!key) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    throw new Error(
      `Supabase: em Vercel faltam: ${missing.join(", ")}. ` +
      "Em Settings → Environment Variables defina ambas (URL e anon JWT). Use 'All Environments' ou o ambiente do deploy. Após salvar, faça Redeploy."
    );
  }
  // A anon key correta é um JWT (começa com eyJ e tem 3 partes). UUID (ex: ba8f8187-...) não funciona.
  if (!key.startsWith("eyJ") || !key.includes(".")) {
    throw new Error("Supabase: use a anon key JWT (começa com eyJ...), não o UUID. Em Supabase: Settings → API → anon public.");
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
