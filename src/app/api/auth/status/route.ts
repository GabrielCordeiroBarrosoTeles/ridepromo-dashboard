import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(c => c.split("="))
    );
    
    const token = cookies["admin-token"];
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "Nenhum token encontrado"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
      return NextResponse.json({
        authenticated: true,
        message: "Token válido",
        user: decoded
      });
    } catch (error) {
      return NextResponse.json({
        authenticated: false,
        message: "Token inválido",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Erro ao verificar autenticação",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}