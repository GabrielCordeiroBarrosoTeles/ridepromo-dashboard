import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password, hash } = await request.json();
    
    const storedHash = "$2b$10$K8gF7Z8QqjKl.rEuIrjOve7Jz9lLdMhVehVWJpbA8M9qGzjKl.rEu";
    
    // Testar com hash fornecido ou hash padrão
    const hashToTest = hash || storedHash;
    
    const isValid = await bcrypt.compare(password, hashToTest);
    
    // Gerar novo hash para comparação
    const newHash = await bcrypt.hash(password, 10);
    const newHashTest = await bcrypt.compare(password, newHash);
    
    return NextResponse.json({
      password,
      hashToTest,
      isValid,
      newHash,
      newHashTest
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Erro ao testar hash",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}