import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createSupabaseClient();
    
    // Buscar todos os usuários
    const { data, error } = await supabase
      .from("admin_users")
      .select("*");

    if (error) {
      return NextResponse.json({ 
        error: "Erro ao buscar usuários", 
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Usuários encontrados",
      users: data,
      count: data?.length || 0
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Erro de conexão", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}