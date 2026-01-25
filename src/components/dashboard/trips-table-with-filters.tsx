"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { TripsTable } from "./trips-table";
import type { TripRow } from "@/types/dashboard";
import type { DriverRateConfigRow } from "@/lib/data";

interface TripsTableWithFiltersProps {
  rows: TripRow[];
  driverRateConfig?: DriverRateConfigRow;
}

export function TripsTableWithFilters({ rows, driverRateConfig }: TripsTableWithFiltersProps) {
  const [filterNome, setFilterNome] = useState("");
  const [filterApp, setFilterApp] = useState("");

  const filtered = useMemo(() => {
    const n = filterNome.trim().toLowerCase();
    const a = filterApp.trim().toLowerCase();
    return rows.filter((r) => {
      if (n && !(r.name ?? "").toLowerCase().includes(n)) return false;
      if (a && !(r.app ?? "").toLowerCase().includes(a)) return false;
      return true;
    });
  }, [rows, filterNome, filterApp]);

  const apps = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      const app = (r.app ?? "").trim();
      if (app) set.add(app);
    });
    return Array.from(set).sort();
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="text"
          placeholder="Nome..."
          value={filterNome}
          onChange={(e) => setFilterNome(e.target.value)}
          className="min-w-[120px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={filterApp}
          onChange={(e) => setFilterApp(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">Todos os apps</option>
          {apps.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>
      </div>
      <TripsTable rows={filtered} driverRateConfig={driverRateConfig} />
    </div>
  );
}
