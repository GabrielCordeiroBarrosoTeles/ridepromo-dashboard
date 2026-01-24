import { createSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * GET /api/supabase-status
 * Verifica se Supabase está configurado e acessível (env + SELECT em trips).
 * Útil para debug quando a tabela de viagens aparece vazia na Vercel.
 */
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

    if (!url || !key) {
      return NextResponse.json(
        {
          status: "missing_env",
          message:
            "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel (Settings > Environment Variables). Use a anon key JWT do Supabase Dashboard > Settings > API.",
        },
        { status: 503 }
      );
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("trips")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
          code: error.code,
          hint: "Verifique RLS: anon precisa de política SELECT em trips e ride_options.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase acessível. Dados vêm de trips + ride_options + users.",
      hasTrips: Array.isArray(data) && data.length > 0,
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
