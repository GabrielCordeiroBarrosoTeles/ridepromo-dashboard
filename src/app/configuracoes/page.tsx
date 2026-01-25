"use client";

import { useEffect, useState } from "react";
import { fetchConfigs } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigsTableWithModal } from "@/components/dashboard/configs-table-with-modal";
import { ProtectedRoute } from "@/hooks/useAuth";
import { ConfigRow } from "@/types";

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const data = await fetchConfigs();
        setConfigs(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido ao carregar configurações";
        console.error("Erro ao carregar configurações:", error);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd6c13] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f5f5f5]">
        <SiteHeader variant="dashboard" />

        <div className="mx-auto max-w-6xl space-y-4 overflow-x-hidden p-3 sm:space-y-6 sm:p-4 md:p-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Configurações</h2>
            <Card>
              <CardHeader>
                <CardTitle>Configurações do app</CardTitle>
                <CardDescription>
                  Todas as chaves da tabela config (Supabase). Clique em uma linha para ver mais informações no modal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigsTableWithModal configs={configs} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
