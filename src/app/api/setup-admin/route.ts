import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSupabaseClient } from "@/lib/supabase";

export async function POST() {
  try {
    // Gerar hash correto para "123456"
    const password = "123456";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log("Hash gerado:", hashedPassword);
    
    const supabase = createSupabaseClient();
    
    // Inserir usuário com hash correto
    const { data, error } = await (supabase as any)
      .from("admin_users")
      .upsert({
        email: "cliente@teste.com",
        password_hash: hashedPassword
      })
      .select();

    if (error) {
      return NextResponse.json({ 
        error: "Erro ao criar usuário", 
        details: error.message 
      }, { status: 500 });
    }

    // Testar se o hash funciona
    const isValid = await bcrypt.compare("123456", hashedPassword);

    return NextResponse.json({ 
      success: true, 
      message: "Usuário admin criado com hash correto",
      user: (data as any)?.[0]?.email,
      hashGenerated: hashedPassword,
      hashTest: isValid
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Erro interno", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}