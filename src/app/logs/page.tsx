"use client";

import { useEffect, useState } from "react";
import { fetchAppLogs, fetchUsersByIds, fetchTripCountByUserIds } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogsTableWithFilters } from "@/components/dashboard/logs-table-with-filters";
import { ProtectedRoute } from "@/hooks/useAuth";
import { LogData } from "@/types";

export default function LogsPage() {
  const [data, setData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const logs = await fetchAppLogs(500);
        const userIds = Array.from(new Set(logs.map((l) => l.user_id).filter(Boolean))) as string[];
        const [users, tripCountByUserId] = await Promise.all([
          fetchUsersByIds(userIds),
          fetchTripCountByUserIds(userIds),
        ]);
        const userNameByUserId: Record<string, string> = {};
        const userPhoneByUserId: Record<string, string> = {};
        users.forEach((u) => {
          if (u.name_user?.trim()) userNameByUserId[u.id_user] = u.name_user.trim();
          if (u.phone?.trim()) userPhoneByUserId[u.id_user] = u.phone.trim();
        });
        setData({ logs, userNameByUserId, userPhoneByUserId, tripCountByUserId });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao carregar logs";
        console.error("Erro ao carregar logs:", error);
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
            <h2 className="mb-4 text-lg font-semibold text-foreground">Logs do app</h2>
            <Card>
              <CardHeader>
                <CardTitle>Falhas e acertos</CardTitle>
                <CardDescription>
                  Eventos enviados pelo app (evento, quantidade, usuário, modelo, versão). Clique no log para ver detalhes e WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data && (
                  <LogsTableWithFilters
                    logs={data.logs}
                    userNameByUserId={data.userNameByUserId}
                    userPhoneByUserId={data.userPhoneByUserId}
                    tripCountByUserId={data.tripCountByUserId}
                  />
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
