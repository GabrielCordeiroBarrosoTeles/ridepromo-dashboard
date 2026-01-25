"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchStats } from "@/lib/data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SiteHeader } from "@/components/site-header";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import Link from "next/link";
import { MapPin, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/hooks/useAuth";

interface Stats {
  totalTrips: number;
  totalUsers: number;
  lastTripAt: string | null;
  isUniqueTrips: boolean;
  totalOptOuts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

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

  if (!stats) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
          <p className="text-muted-foreground">Erro ao carregar dados</p>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f5f5f5]">
        <SiteHeader variant="dashboard">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        </SiteHeader>

        <div className="mx-auto max-w-6xl space-y-4 overflow-x-hidden p-3 sm:space-y-6 sm:p-4 md:p-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Visão geral</h2>
            <StatsCards
              totalTrips={stats.totalTrips}
              totalUsers={stats.totalUsers}
              lastTripAt={stats.lastTripAt}
              isUniqueTrips={stats.isUniqueTrips}
              totalOptOuts={stats.totalOptOuts}
            />
          </section>

          <section>
            <Link
              href="/viagens"
              className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fd6c13]/15">
                  <MapPin className="h-5 w-5 text-[#fd6c13]" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Ver todas as viagens</h3>
                  <p className="text-sm text-muted-foreground">Lista completa com filtros e paginação</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" aria-hidden />
            </Link>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
