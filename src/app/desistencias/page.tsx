"use client";

import { useEffect, useState } from "react";
import { fetchDesistencias } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { DesistenciasTableWithModal } from "@/components/dashboard/desistencias-table-with-modal";
import { ProtectedRoute } from "@/hooks/useAuth";

import { OptOutRow } from "@/types";

export default function DesistenciasPage() {
  const [rows, setRows] = useState<OptOutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const data = await fetchDesistencias(200);
        setRows(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao carregar desistências";
        console.error("Erro ao carregar desistências:", error);
        setError(errorMessage);
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Desistências</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nome do cliente, modelo do celular e viagem vinculada. Clique em uma linha com viagem para ver os detalhes.
                </p>
              </div>
              <RefreshButton />
            </div>
            <DesistenciasTableWithModal rows={rows} />
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
