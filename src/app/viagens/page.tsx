"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTripRows, fetchDriverRateConfig, TRIPS_PAGE_SIZE } from "@/lib/data";
import { TripsTableWithFilters } from "@/components/dashboard/trips-table-with-filters";
import { TripsPagination } from "@/components/dashboard/trips-pagination";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/hooks/useAuth";
import { ViagensPageData } from "@/types";

export default function ViagensPage() {
  const [data, setData] = useState<ViagensPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const offset = (currentPage - 1) * TRIPS_PAGE_SIZE;

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [tripData, driverConfig] = await Promise.all([
          fetchTripRows(TRIPS_PAGE_SIZE, offset),
          fetchDriverRateConfig(),
        ]);
        setData({ tripData, driverConfig });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao carregar dados";
        console.error("Erro ao carregar dados:", error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [offset]);

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
        <SiteHeader variant="dashboard">
          <RefreshButton />
        </SiteHeader>

        <div className="mx-auto max-w-6xl space-y-4 overflow-x-hidden p-3 sm:space-y-6 sm:p-4 md:p-6">
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Viagens</CardTitle>
                <CardDescription>Nome, valor do app, valor com desconto e link para WhatsApp do cliente.</CardDescription>
              </CardHeader>
              <CardContent>
                {data && (
                  <>
                    <TripsTableWithFilters rows={data.tripData.rows} driverRateConfig={data.driverConfig} />
                    <TripsPagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(data.tripData.total / TRIPS_PAGE_SIZE)}
                      total={data.tripData.total}
                      pageSize={TRIPS_PAGE_SIZE}
                      basePath="/viagens"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
