import { fetchStats, fetchTripRows } from "@/lib/data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TripsTable } from "@/components/dashboard/trips-table";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [stats, rows] = await Promise.all([fetchStats(), fetchTripRows(100)]);

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <header className="border-b bg-[#fd6c13] px-4 py-4 text-white shadow-sm md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold md:text-2xl">RidePromo</h1>
          <RefreshButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Visão geral</h2>
          <StatsCards totalTrips={stats.totalTrips} totalUsers={stats.totalUsers} lastTripAt={stats.lastTripAt} />
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Viagens</CardTitle>
              <CardDescription>Nome, valor do app, valor com desconto e link para WhatsApp do cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <TripsTable rows={rows} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
