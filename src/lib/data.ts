import { createSupabaseClient } from "./supabase";
import type { TripRow } from "@/types/dashboard";

const DESCONTO_PERCENT = 0.2;

export async function fetchTripRows(limit = 100): Promise<TripRow[]> {
  const supabase = createSupabaseClient();

  const { data: trips, error: eTrips } = await supabase
    .from("trips")
    .select("id, origin, destination, app, user_id, created_at")
    .order("id", { ascending: false })
    .limit(limit);

  if (eTrips || !trips?.length) return [];

  const tripIds = trips.map((t) => t.id);
  const userIds = [...new Set(trips.map((t) => t.user_id).filter(Boolean))] as string[];

  const [resOptions, resUsers] = await Promise.all([
    supabase.from("ride_options").select("trip_id, value").in("trip_id", tripIds),
    userIds.length ? supabase.from("users").select("id_user, name_user, phone").in("id_user", userIds) : { data: [] as { id_user: string; name_user: string | null; phone: string | null }[] },
  ]);

  const options = resOptions.data ?? [];
  const users = (resUsers.data ?? []) as { id_user: string; name_user: string | null; phone: string | null }[];
  const userMap = new Map(users.map((u) => [u.id_user, u]));

  return trips.map((t) => {
    const user = t.user_id ? userMap.get(t.user_id) : null;
    const tripOptions = options.filter((o) => o.trip_id === t.id);
    const values = tripOptions.map((o) => Number(o.value)).filter(Number.isFinite);
    const valorApp = values.length ? Math.min(...values) : 0;
    const valorComDesconto = valorApp * (1 - DESCONTO_PERCENT);

    return {
      id: t.id,
      name: user?.name_user?.trim() || "—",
      phone: user?.phone?.trim() || null,
      origin: t.origin,
      destination: t.destination,
      app: t.app,
      valorApp,
      valorComDesconto,
      createdAt: t.created_at,
    };
  });
}

export async function fetchStats(): Promise<{ totalTrips: number; totalUsers: number; lastTripAt: string | null }> {
  const supabase = createSupabaseClient();

  const [rCount, rLast, rUsers] = await Promise.all([
    supabase.from("trips").select("id", { count: "exact", head: true }),
    supabase.from("trips").select("created_at").order("id", { ascending: false }).limit(1),
    supabase.from("trips").select("user_id").not("user_id", "is", null),
  ]);

  const totalTrips = rCount.count ?? 0;
  const lastTripAt = (rLast.data as { created_at?: string }[] | null)?.[0]?.created_at ?? null;
  const uniq = new Set((rUsers.data ?? []).map((r) => r.user_id));
  const totalUsers = uniq.size;

  return { totalTrips, totalUsers, lastTripAt };
}
