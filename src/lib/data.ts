import { createSupabaseClient } from "./supabase";
import type { TripRow } from "@/types/dashboard";

/** Fallback para viagens antigas sem discount_percent (ex.: 20%). */
const DESCONTO_FALLBACK = 0.2;

/** Extrai valor numérico de strings como "R$ 12,34", "R$ 1.234,56", "12.34". */
function parsePrice(s: string | null | undefined): number | null {
  if (s == null || typeof s !== "string") return null;
  const n = s.replace(/\s/g, "").replace(/R\$/i, "");
  const lastComma = n.lastIndexOf(",");
  const lastDot = n.lastIndexOf(".");
  const lastSep = Math.max(lastComma, lastDot);
  if (lastSep === -1) return Number(n) || null;
  const intPart = n.slice(0, lastSep).replace(/[.,]/g, "");
  const decPart = n.slice(lastSep + 1).replace(/\D/g, "");
  const combined = decPart ? `${intPart}.${decPart}` : intPart;
  return Number(combined) || null;
}

const PAGE_SIZE_DEFAULT = 20;

export async function fetchTripRows(limit = PAGE_SIZE_DEFAULT, offset = 0): Promise<{ rows: TripRow[]; total: number }> {
  try {
    const supabase = createSupabaseClient();
    const from = offset;
    const to = offset + limit - 1;

    const { data: trips, error: eTrips, count } = await supabase
      .from("trips")
      .select("id, origin, destination, app, user_id, created_at, discount_percent", { count: "exact" })
      .order("id", { ascending: false })
      .range(from, to);

    if (eTrips) {
      console.error("[fetchTripRows] Supabase trips:", eTrips.message, eTrips.code, eTrips.details);
      return { rows: [], total: 0 };
    }
    const total = typeof count === "number" ? count : 0;
    if (!trips?.length) return { rows: [], total };

    const tripIds = trips.map((t) => t.id);
    const userIds = [...new Set(trips.map((t) => t.user_id).filter(Boolean))] as string[];

    const [resOptions, resUsers] = await Promise.all([
      supabase.from("ride_options").select("trip_id, type, name, price, value, estimated_time").in("trip_id", tripIds),
      userIds.length ? supabase.from("users").select("id_user, name_user, phone").in("id_user", userIds) : { data: [] as { id_user: string; name_user: string | null; phone: string | null }[] },
    ]);

    const options = resOptions.data ?? [];
    const users = (resUsers.data ?? []) as { id_user: string; name_user: string | null; phone: string | null }[];
    const userMap = new Map(users.map((u) => [u.id_user, u]));

    const rows = trips.map((t) => {
      const user = t.user_id ? userMap.get(t.user_id) : null;
      const tripOptions = options.filter((o) => String(o.trip_id) === String(t.id));
      const values = tripOptions.flatMap((o) => {
        const v = o.value;
        if (v != null && Number.isFinite(Number(v))) return [Number(v)];
        const p = parsePrice(o.price);
        return p != null ? [p] : [];
      });
      // Valor mínimo entre as opções (Pop, Moto, etc.) para exibir "Valor no app"
      const valorApp = values.length ? Math.min(...values) : 0;
      const pct = t.discount_percent != null && Number.isFinite(Number(t.discount_percent)) ? Number(t.discount_percent) : DESCONTO_FALLBACK;
      const valorComDesconto = valorApp * (1 - pct);
      const rides = tripOptions.map((o) => ({
        type: o.type ?? null,
        name: o.name ?? null,
        price: o.price ?? null,
        value: o.value != null && Number.isFinite(Number(o.value)) ? Number(o.value) : null,
        estimatedTime: o.estimated_time ?? null,
      }));

      return {
        id: t.id,
        name: user?.name_user?.trim() || "—",
        phone: user?.phone?.trim() || null,
        origin: t.origin,
        destination: t.destination,
        app: t.app,
        valorApp,
        valorComDesconto,
        discountPercent: t.discount_percent != null && Number.isFinite(Number(t.discount_percent)) ? Math.round(Number(t.discount_percent) * 100) : null,
        createdAt: t.created_at,
        rides,
      };
    });
    return { rows, total };
  } catch (e) {
    console.error("[fetchTripRows]", e);
    return { rows: [], total: 0 };
  }
}

export const TRIPS_PAGE_SIZE = PAGE_SIZE_DEFAULT;

export interface ClienteRow {
  id_user: string;
  name_user: string | null;
  phone: string | null;
  email: string | null;
}

/** Lista usuários que têm ao menos uma viagem com login (user_id em trips). */
export async function fetchClientes(): Promise<ClienteRow[]> {
  try {
    const supabase = createSupabaseClient();
    const { data: trips, error: eTrips } = await supabase
      .from("trips")
      .select("user_id")
      .not("user_id", "is", null);
    if (eTrips || !trips?.length) return [];
    const ids = [...new Set(trips.map((r) => r.user_id).filter(Boolean))] as string[];
    if (ids.length === 0) return [];

    const { data: users, error: eUsers } = await supabase
      .from("users")
      .select("id_user, name_user, phone, email")
      .in("id_user", ids)
      .order("name_user", { ascending: true, nullsFirst: false });

    if (eUsers) {
      console.error("[fetchClientes] users:", eUsers.message);
      return [];
    }
    return (users ?? []) as ClienteRow[];
  } catch (e) {
    console.error("[fetchClientes]", e);
    return [];
  }
}

export async function fetchStats(): Promise<{
  totalTrips: number;
  totalUsers: number;
  lastTripAt: string | null;
  isUniqueTrips: boolean;
}> {
  try {
    const supabase = createSupabaseClient();
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_dashboard_stats");
    if (!rpcError && rpcData && typeof rpcData === "object") {
      const d = rpcData as { unique_trips?: number; total_users?: number; last_trip_at?: string | null };
      return {
        totalTrips: Number(d.unique_trips) || 0,
        totalUsers: Number(d.total_users) || 0,
        lastTripAt: d.last_trip_at ?? null,
        isUniqueTrips: true,
      };
    }
    if (rpcError) {
      console.warn("[fetchStats] get_dashboard_stats não encontrada ou erro. Rode scripts/supabase_get_dashboard_stats.sql no Supabase. Fallback: count em trips.");
    }

    const [rCount, rLast, rUsers] = await Promise.all([
      supabase.from("trips").select("id", { count: "exact", head: true }),
      supabase.from("trips").select("created_at").order("id", { ascending: false }).limit(1),
      supabase.from("trips").select("user_id").not("user_id", "is", null),
    ]);

    if (rCount.error) {
      console.error("[fetchStats] Supabase count error:", rCount.error.message, rCount.error.code);
    }

    const totalTrips = rCount.count ?? 0;
    const lastTripAt = (rLast.data as { created_at?: string }[] | null)?.[0]?.created_at ?? null;
    const uniq = new Set((rUsers.data ?? []).map((r) => r.user_id));
    const totalUsers = uniq.size;

    return { totalTrips, totalUsers, lastTripAt, isUniqueTrips: false };
  } catch (e) {
    console.error("[fetchStats]", e);
    return { totalTrips: 0, totalUsers: 0, lastTripAt: null, isUniqueTrips: false };
  }
}
