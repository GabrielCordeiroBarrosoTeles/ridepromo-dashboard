import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log("[MIDDLEWARE EXECUTANDO] Pathname:", pathname);

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = [
    "/politica",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/status"
  ];

  // Se é rota pública, permitir acesso
  if (publicRoutes.includes(pathname)) {
    console.log("[MIDDLEWARE] Rota pública:", pathname);
    return NextResponse.next();
  }

  // Se é a página inicial, permitir (para mostrar modal de login)
  if (pathname === "/") {
    console.log("[MIDDLEWARE] Página inicial");
    return NextResponse.next();
  }

  // Todas as outras rotas são protegidas
  const token = request.cookies.get("admin-token")?.value;
  console.log("[MIDDLEWARE] Token encontrado:", !!token);

  if (!token) {
    console.log("[MIDDLEWARE] Redirecionando para /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Remover JWT verification temporariamente para testar
    console.log("[MIDDLEWARE] Permitindo acesso com token");
    return NextResponse.next();
  } catch {
    console.log("[MIDDLEWARE] Token inválido, redirecionando");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("admin-token", "", { maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};