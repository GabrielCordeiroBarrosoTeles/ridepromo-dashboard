"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LoginModal } from "@/components/LoginModal";
import { CarFront, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      setShowLoginModal(false);
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      throw new Error(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <SiteHeader variant="landing">
        <button
          onClick={() => setShowLoginModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#fd6c13] shadow-sm transition hover:bg-white/95 hover:shadow"
          aria-label="Acessar o painel administrativo"
        >
          Acessar Dashboard
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </SiteHeader>

      <div className="mx-auto max-w-4xl space-y-16 overflow-x-hidden px-4 py-10 sm:px-6 md:py-16">
        {/* Hero */}
        <section className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fd6c13] text-white shadow-lg">
            <CarFront className="h-8 w-8" aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            RidePromo
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Sugestões de preços sempre seguras para sua mobilidade urbana.
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Compare preços de 99, Uber, InDriver e outras plataformas em um só lugar.
          </p>
        </section>

        {/* O que é */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground sm:text-2xl">O que é o RidePromo?</h2>
          <p className="text-muted-foreground leading-relaxed">
            O RidePromo é um aplicativo que acompanha o uso de apps de mobilidade (99, Uber, InDriver etc.)
            e exibe sugestões de preços com desconto, usando motoristas de várias plataformas mas
            validados para sua segurança. Você vê o valor sugerido antes de confirmar a corrida e
            pode comparar ofertas em tempo real.
          </p>
        </section>

        {/* Como funciona */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground sm:text-2xl">Como funciona?</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fd6c13]/15 text-[#fd6c13] font-medium">1</span>
              <span>Você abre um app de corrida (99, Uber, InDriver…) e solicita uma viagem.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fd6c13]/15 text-[#fd6c13] font-medium">2</span>
              <span>O RidePromo detecta a tela de preço e mostra um modal com sugestão de valor com desconto.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fd6c13]/15 text-[#fd6c13] font-medium">3</span>
              <span>Você pode aceitar a sugestão e seguir para a tela “Tudo pronto” ou fechar e continuar no app original.</span>
            </li>
          </ul>
        </section>

        {/* Benefícios */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground sm:text-2xl">Benefícios</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm">
              <Shield className="h-6 w-6 shrink-0 text-[#fd6c13]" aria-hidden />
              <div>
                <h3 className="font-medium text-foreground">Segurança</h3>
                <p className="text-sm text-muted-foreground">Motoristas validados; sugestões baseadas em valores mínimos por km/hora.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm">
              <Zap className="h-6 w-6 shrink-0 text-[#fd6c13]" aria-hidden />
              <div>
                <h3 className="font-medium text-foreground">Desconto</h3>
                <p className="text-sm text-muted-foreground">Sugestão de preço com desconto em relação ao valor do app.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm sm:col-span-2">
              <BarChart3 className="h-6 w-6 shrink-0 text-[#fd6c13]" aria-hidden />
              <div>
                <h3 className="font-medium text-foreground">Transparência</h3>
                <p className="text-sm text-muted-foreground">Comparação entre apps e visão do valor no app vs. valor sugerido.</p>
              </div>
            </div>
          </div>
        </section>


      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </main>
  );
}
