import { createSupabaseClient } from "./supabase";
import type { TripRow, ClienteRow, AppLogRow, ConfigRow, DriverRateConfigRow, OptOutRow } from "@/types";

/** Fallback para viagens antigas sem discount_percent (ex.: 20%). */
const DESCONTO_FALLBACK = 0.2;

/** Extrai valor numérico de strings como "R$ 12,34", "R$ 1.234,56", "12.34". */
function parsePrice(s: string | null | undefined): number | null {
  if (s == null || typeof s !== "string") return null;
  
  // Remove espaços e R$ de uma vez
  const cleaned = s.replace(/\s|R\$/gi, "");
  if (!cleaned) return null;
  
  // Encontra o último separador decimal (. ou ,)
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  const lastSep = Math.max(lastComma, lastDot);
  
  if (lastSep === -1) {
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
  }
  
  // Separa parte inteira e decimal
  const intPart = cleaned.slice(0, lastSep).replace(/[.,]/g, "");
  const decPart = cleaned.slice(lastSep + 1).replace(/\D/g, "");
  const combined = decPart ? `${intPart}.${decPart}` : intPart;
  
  const num = Number(combined);
  return Number.isFinite(num) ? num : null;
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
      console.error("[fetchTripRows] Supabase trips:", { message: eTrips.message, code: eTrips.code });
      return { rows: [], total: 0 };
    }
    const total = typeof count === "number" ? count : 0;
    if (!trips?.length) return { rows: [], total };

    const tripIds = (trips as any[]).map((t: any) => t.id);
    const userIds = Array.from(new Set((trips as any[]).map((t: any) => t.user_id).filter(Boolean))) as string[];

    const [resOptions, resUsers] = await Promise.all([
      supabase.from("ride_options").select("trip_id, type, name, price, value, estimated_time, driver_value_per_km, driver_value_per_hour, pickup_km, trip_km, total_km, pickup_min, trip_duration_min, total_min, meets_min_per_km, meets_min_per_hour").in("trip_id", tripIds),
      userIds.length ? supabase.from("users").select("id_user, name_user, phone").in("id_user", userIds) : { data: [] as { id_user: string; name_user: string | null; phone: string | null }[] },
    ]);

    const options = (resOptions.data ?? []) as any[];
    const users = (resUsers.data ?? []) as { id_user: string; name_user: string | null; phone: string | null }[];
    const userMap = new Map(users.map((u) => [u.id_user, u]));

    const rows = (trips as any[]).map((t: any) => {
      const user = t.user_id ? userMap.get(t.user_id) : null;
      const tripOptions = options.filter((o: any) => String(o.trip_id) === String(t.id));
      const values = tripOptions.flatMap((o: any) => {
        const v = o.value;
        if (v != null && Number.isFinite(Number(v))) return [Number(v)];
        const p = parsePrice(o.price);
        return p != null ? [p] : [];
      });
      // Valor mínimo entre as opções (Pop, Moto, etc.) para exibir "Valor no app"
      const valorApp = values.length ? Math.min(...values) : 0;
      const pct = t.discount_percent != null && Number.isFinite(Number(t.discount_percent)) ? Number(t.discount_percent) : DESCONTO_FALLBACK;
      const valorComDesconto = valorApp * (1 - pct);
      const rides = tripOptions.map((o: any) => ({
        type: o.type ?? null,
        name: o.name ?? null,
        price: o.price ?? null,
        value: o.value != null && Number.isFinite(Number(o.value)) ? Number(o.value) : null,
        estimatedTime: o.estimated_time ?? null,
        driverValuePerKm: o.driver_value_per_km != null && Number.isFinite(Number(o.driver_value_per_km)) ? Number(o.driver_value_per_km) : null,
        driverValuePerHour: o.driver_value_per_hour != null && Number.isFinite(Number(o.driver_value_per_hour)) ? Number(o.driver_value_per_hour) : null,
        pickupKm: o.pickup_km != null && Number.isFinite(Number(o.pickup_km)) ? Number(o.pickup_km) : null,
        tripKm: o.trip_km != null && Number.isFinite(Number(o.trip_km)) ? Number(o.trip_km) : null,
        totalKm: o.total_km != null && Number.isFinite(Number(o.total_km)) ? Number(o.total_km) : null,
        pickupMin: o.pickup_min != null ? Number(o.pickup_min) : null,
        tripDurationMin: o.trip_duration_min != null ? Number(o.trip_duration_min) : null,
        totalMin: o.total_min != null ? Number(o.total_min) : null,
        meetsMinPerKm: o.meets_min_per_km ?? null,
        meetsMinPerHour: o.meets_min_per_hour ?? null,
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

/** Busca uma viagem por id (para modal de detalhes na página de desistências). */
export async function fetchTripById(tripId: number): Promise<TripRow | null> {
  try {
    const supabase = createSupabaseClient();
    const { data: trips, error: eTrips } = await supabase
      .from("trips")
      .select("id, origin, destination, app, user_id, created_at, discount_percent")
      .eq("id", tripId)
      .limit(1);
    if (eTrips || !trips?.length) return null;
    const t = trips[0] as { id: number; origin: string | null; destination: string | null; app: string | null; user_id: string | null; created_at: string | null; discount_percent: number | null };
    const [resOptions, resUsers] = await Promise.all([
      supabase.from("ride_options").select("trip_id, type, name, price, value, estimated_time, driver_value_per_km, driver_value_per_hour, pickup_km, trip_km, total_km, pickup_min, trip_duration_min, total_min, meets_min_per_km, meets_min_per_hour").eq("trip_id", t.id),
      t.user_id ? supabase.from("users").select("id_user, name_user, phone").eq("id_user", t.user_id) : { data: [] as { id_user: string; name_user: string | null; phone: string | null }[] },
    ]);
    const options = resOptions.data ?? [];
    const users = (resUsers.data ?? []) as { id_user: string; name_user: string | null; phone: string | null }[];
    const user = t.user_id ? users.find((u) => u.id_user === t.user_id) : null;
    const tripOptions = options.filter((o: { trip_id: number }) => Number(o.trip_id) === t.id);
    const values = tripOptions.flatMap((o: { value?: number; price?: string }) => {
      const v = o.value;
      if (v != null && Number.isFinite(Number(v))) return [Number(v)];
      const p = parsePrice(o.price);
      return p != null ? [p] : [];
    });
    const valorApp = values.length ? Math.min(...values) : 0;
    const pct = t.discount_percent != null && Number.isFinite(Number(t.discount_percent)) ? Number(t.discount_percent) : DESCONTO_FALLBACK;
    const valorComDesconto = valorApp * (1 - pct);
    type Opt = { trip_id?: number; type?: string; name?: string; price?: string; value?: number; estimated_time?: string; driver_value_per_km?: number; driver_value_per_hour?: number; pickup_km?: number; trip_km?: number; total_km?: number; pickup_min?: number; trip_duration_min?: number; total_min?: number; meets_min_per_km?: boolean; meets_min_per_hour?: boolean };
    const rides = tripOptions.map((o: Opt) => ({
      type: (o.type ?? null) as string | null,
      name: (o.name ?? null) as string | null,
      price: (o.price ?? null) as string | null,
      value: o.value != null && Number.isFinite(Number(o.value)) ? Number(o.value) : null,
      estimatedTime: (o.estimated_time ?? null) as string | null,
      driverValuePerKm: o.driver_value_per_km != null && Number.isFinite(Number(o.driver_value_per_km)) ? Number(o.driver_value_per_km) : null,
      driverValuePerHour: o.driver_value_per_hour != null && Number.isFinite(Number(o.driver_value_per_hour)) ? Number(o.driver_value_per_hour) : null,
      pickupKm: o.pickup_km != null && Number.isFinite(Number(o.pickup_km)) ? Number(o.pickup_km) : null,
      tripKm: o.trip_km != null && Number.isFinite(Number(o.trip_km)) ? Number(o.trip_km) : null,
      totalKm: o.total_km != null && Number.isFinite(Number(o.total_km)) ? Number(o.total_km) : null,
      pickupMin: o.pickup_min != null ? Number(o.pickup_min) : null,
      tripDurationMin: o.trip_duration_min != null ? Number(o.trip_duration_min) : null,
      totalMin: o.total_min != null ? Number(o.total_min) : null,
      meetsMinPerKm: o.meets_min_per_km ?? null,
      meetsMinPerHour: o.meets_min_per_hour ?? null,
    }));
    return {
      id: t.id,
      name: user?.name_user?.trim() || "—",
      phone: user?.phone?.trim() ?? null,
      origin: t.origin,
      destination: t.destination,
      app: t.app,
      valorApp,
      valorComDesconto,
      discountPercent: t.discount_percent != null && Number.isFinite(Number(t.discount_percent)) ? Math.round(Number(t.discount_percent) * 100) : null,
      createdAt: t.created_at,
      rides,
    };
  } catch (e) {
    console.error("[fetchTripById]", e);
    return null;
  }
}

/** Lista usuários que têm ao menos uma viagem com login (user_id em trips), com contagem de viagens. */
export async function fetchClientes(): Promise<ClienteRow[]> {
  try {
    const supabase = createSupabaseClient();
    const { data: trips, error: eTrips } = await supabase
      .from("trips")
      .select("user_id")
      .not("user_id", "is", null);
    if (eTrips || !trips?.length) return [];
    const ids = Array.from(new Set((trips as any[]).map((r: any) => r.user_id).filter(Boolean))) as string[];
    if (ids.length === 0) return [];

    const tripCountByUser: Record<string, number> = {};
    (trips as any[]).forEach((t: any) => {
      if (t.user_id) tripCountByUser[t.user_id] = (tripCountByUser[t.user_id] ?? 0) + 1;
    });

    const { data: users, error: eUsers } = await supabase
      .from("users")
      .select("id_user, name_user, phone, email")
      .in("id_user", ids)
      .order("name_user", { ascending: true, nullsFirst: false });

    if (eUsers) {
      console.error("[fetchClientes] users:", eUsers.message);
      return [];
    }
    return ((users ?? []) as Omit<ClienteRow, "trip_count">[]).map((u) => ({
      ...u,
      trip_count: tripCountByUser[u.id_user] ?? 0,
    }));
  } catch (e) {
    console.error("[fetchClientes]", e);
    return [];
  }
}

/** Busca usuários por id_user (para exibir nome e telefone nos logs). */
export async function fetchUsersByIds(
  ids: string[],
): Promise<{ id_user: string; name_user: string | null; phone: string | null }[]> {
  if (!ids.length) return [];
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("id_user, name_user, phone")
      .in("id_user", ids);
    if (error) {
      console.error("[fetchUsersByIds]", error.message);
      return [];
    }
    return (data ?? []) as { id_user: string; name_user: string | null; phone: string | null }[];
  } catch (e) {
    console.error("[fetchUsersByIds]", e);
    return [];
  }
}

/** Retorna contagem de viagens por user_id (para os ids informados). */
export async function fetchTripCountByUserIds(ids: string[]): Promise<Record<string, number>> {
  if (!ids.length) return {};
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("trips")
      .select("user_id")
      .not("user_id", "is", null)
      .in("user_id", ids);
    if (error) {
      console.error("[fetchTripCountByUserIds]", error.message);
      return {};
    }
    const counts: Record<string, number> = {};
    (data ?? []).forEach((r: { user_id: string }) => {
      if (r.user_id) counts[r.user_id] = (counts[r.user_id] ?? 0) + 1;
    });
    return counts;
  } catch (e) {
    console.error("[fetchTripCountByUserIds]", e);
    return {};
  }
}

/** Lista logs do app (app_logs) para a página Logs do dashboard. */
export async function fetchAppLogs(limit = 200): Promise<AppLogRow[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("app_logs")
      .select("id, log_code, count, user_id, created_at, metadata")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("[fetchAppLogs] Supabase:", error.message, error.code);
      return [];
    }
    return (data ?? []) as AppLogRow[];
  } catch (e) {
    console.error("[fetchAppLogs]", e);
    return [];
  }
}

const DRIVER_RATE_KEYS = {
  minPerKmCar: "driver_min_value_per_km_car",
  minPerKmMoto: "driver_min_value_per_km_moto",
  minPerHourCar: "driver_min_value_per_hour_car",
  minPerHourMoto: "driver_min_value_per_hour_moto",
} as const;

const DRIVER_RATE_DEFAULTS: DriverRateConfigRow = {
  minPerKmCar: 1.8,
  minPerKmMoto: 1.2,
  minPerHourCar: 25,
  minPerHourMoto: 20,
};

/** Busca os valores mínimos R$/km e R$/h da tabela config (para exibir no modal de viagem). */
export async function fetchDriverRateConfig(): Promise<DriverRateConfigRow> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("config")
      .select("key, value")
      .in("key", Object.values(DRIVER_RATE_KEYS));
    if (error) {
      console.error("[fetchDriverRateConfig] Supabase:", error.message);
      return DRIVER_RATE_DEFAULTS;
    }
    const map = new Map<string, string>();
    (data ?? []).forEach((r: { key: string; value: string }) => { map.set(r.key, r.value); });
    const parse = (key: keyof typeof DRIVER_RATE_KEYS) => {
      const v = map.get(DRIVER_RATE_KEYS[key]);
      const n = v != null ? parseFloat(String(v).replace(",", ".")) : NaN;
      return Number.isFinite(n) ? n : DRIVER_RATE_DEFAULTS[key];
    };
    return {
      minPerKmCar: parse("minPerKmCar"),
      minPerKmMoto: parse("minPerKmMoto"),
      minPerHourCar: parse("minPerHourCar"),
      minPerHourMoto: parse("minPerHourMoto"),
    };
  } catch (e) {
    console.error("[fetchDriverRateConfig]", e);
    return DRIVER_RATE_DEFAULTS;
  }
}

/** Lista todas as configurações da tabela config (Supabase). */
export async function fetchConfigs(): Promise<ConfigRow[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("config")
      .select("key, value, description, created_at, updated_at")
      .order("key", { ascending: true });
    if (error) {
      console.error("[fetchConfigs] Supabase:", error.message, error.code);
      return [];
    }
    return (data ?? []) as ConfigRow[];
  } catch (e) {
    console.error("[fetchConfigs]", e);
    return [];
  }
}

export async function fetchStats(): Promise<{
  totalTrips: number;
  totalUsers: number;
  lastTripAt: string | null;
  isUniqueTrips: boolean;
  totalOptOuts: number;
}> {
  try {
    const supabase = createSupabaseClient();
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_dashboard_stats");
    let totalTrips = 0;
    let totalUsers = 0;
    let lastTripAt: string | null = null;
    let isUniqueTrips = false;

    if (!rpcError && rpcData && typeof rpcData === "object") {
      const d = rpcData as { unique_trips?: number; total_users?: number; last_trip_at?: string | null };
      totalTrips = Number(d.unique_trips) || 0;
      totalUsers = Number(d.total_users) || 0;
      lastTripAt = d.last_trip_at ?? null;
      isUniqueTrips = true;
    } else {
      if (rpcError) {
        console.warn("[fetchStats] get_dashboard_stats não encontrada ou erro. Rode scripts/supabase_get_dashboard_stats.sql no Supabase. Fallback: count em trips.");
      }
      const [rCount, rLast, rUsers] = await Promise.all([
        supabase.from("trips").select("id", { count: "exact", head: true }),
        supabase.from("trips").select("created_at").order("id", { ascending: false }).limit(1),
        supabase.from("trips").select("user_id").not("user_id", "is", null),
      ]);
      if (rCount.error) {
        console.error("[fetchStats] Supabase count error:", { message: rCount.error.message, code: rCount.error.code });
      }
      totalTrips = rCount.count ?? 0;
      lastTripAt = (rLast.data as { created_at?: string }[] | null)?.[0]?.created_at ?? null;
      const uniq = new Set((rUsers.data as any[] ?? []).map((r: any) => r.user_id));
      totalUsers = uniq.size;
    }

    const { count: optOutCount } = await supabase
      .from("opt_outs")
      .select("id", { count: "exact", head: true });
    const totalOptOuts = optOutCount ?? 0;

    return { totalTrips, totalUsers, lastTripAt, isUniqueTrips, totalOptOuts };
  } catch (e) {
    console.error("[fetchStats]", e);
    return { totalTrips: 0, totalUsers: 0, lastTripAt: null, isUniqueTrips: false, totalOptOuts: 0 };
  }
}

/** Lista registros de desistência (opt_outs) com nome do cliente e viagem vinculada. */
export async function fetchDesistencias(limit = 200): Promise<OptOutRow[]> {
  try {
    const supabase = createSupabaseClient();
    const { data: optOuts, error: eOpt } = await supabase
      .from("opt_outs")
      .select("id, user_id, device_model, app_version, app_name, occurred_at, created_at, trip_id")
      .order("occurred_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit);
    if (eOpt) {
      console.error("[fetchDesistencias] opt_outs:", eOpt.message, eOpt.code);
      return [];
    }
    const list = (optOuts ?? []) as { id: number; user_id: string | null; device_model: string | null; app_version: string | null; app_name: string | null; occurred_at: string | null; created_at: string | null; trip_id: number | null }[];
    if (list.length === 0) return [];

    const userIds = Array.from(new Set(list.map((r) => r.user_id).filter(Boolean))) as string[];
    const tripIds = Array.from(new Set(list.map((r) => r.trip_id).filter((id): id is number => id != null && id > 0)));

    const [resUsers, resTrips] = await Promise.all([
      userIds.length ? supabase.from("users").select("id_user, name_user").in("id_user", userIds) : { data: [] as { id_user: string; name_user: string | null }[] },
      tripIds.length ? supabase.from("trips").select("id, origin, destination, app, created_at").in("id", tripIds) : { data: [] as { id: number; origin: string | null; destination: string | null; app: string | null; created_at: string | null }[] },
    ]);
    const users = (resUsers.data ?? []) as { id_user: string; name_user: string | null }[];
    const trips = (resTrips.data ?? []) as { id: number; origin: string | null; destination: string | null; app: string | null; created_at: string | null }[];
    const userMap = new Map(users.map((u) => [u.id_user, u]));
    const tripMap = new Map(trips.map((t) => [t.id, t]));

    return list.map((r) => {
      const user = r.user_id ? userMap.get(r.user_id) : null;
      const trip = r.trip_id != null ? tripMap.get(r.trip_id) : null;
      return {
        id: r.id,
        user_id: r.user_id,
        device_model: r.device_model,
        app_version: r.app_version,
        app_name: r.app_name,
        occurred_at: r.occurred_at,
        created_at: r.created_at,
        trip_id: r.trip_id,
        client_name: user?.name_user?.trim() ?? null,
        trip_origin: trip?.origin ?? null,
        trip_destination: trip?.destination ?? null,
        trip_app: trip?.app ?? null,
        trip_created_at: trip?.created_at ?? null,
      };
    });
  } catch (e) {
    console.error("[fetchDesistencias]", e);
    return [];
  }
}
