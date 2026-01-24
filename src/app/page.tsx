import { redirect } from "next/navigation";
import { fetchStats, fetchTripRows, TRIPS_PAGE_SIZE } from "@/lib/data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TripsTable } from "@/components/dashboard/trips-table";
import { TripsPagination } from "@/components/dashboard/trips-pagination";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string | string[] };
}) {
  const p = searchParams?.page;
  const pageParam = Array.isArray(p) ? p[0] : p;
  const page = Math.max(1, parseInt(String(pageParam || "1"), 10) || 1);
  const offset = (page - 1) * TRIPS_PAGE_SIZE;

  const [stats, { rows, total }] = await Promise.all([
    fetchStats(),
    fetchTripRows(TRIPS_PAGE_SIZE, offset),
  ]);

  const totalPages = total === 0 ? 1 : Math.ceil(total / TRIPS_PAGE_SIZE);
  if (page > totalPages && total > 0) redirect(`/?page=${totalPages}`);
  const currentPage = total === 0 ? 1 : Math.min(page, totalPages);

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
          <StatsCards totalTrips={stats.totalTrips} totalUsers={stats.totalUsers} lastTripAt={stats.lastTripAt} isUniqueTrips={stats.isUniqueTrips} />
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Viagens</CardTitle>
              <CardDescription>Nome, valor do app, valor com desconto e link para WhatsApp do cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <TripsTable rows={rows} />
              <TripsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                pageSize={TRIPS_PAGE_SIZE}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
