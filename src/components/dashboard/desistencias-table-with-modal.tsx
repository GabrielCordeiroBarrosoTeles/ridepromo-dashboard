"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { TripDetailModal } from "@/components/dashboard/trip-detail-modal";
import { formatDateTimeBR, deviceModelDisplay } from "@/lib/utils";
import type { OptOutRow } from "@/lib/data";
import type { TripRow } from "@/types/dashboard";
import type { DriverRateConfigRow } from "@/lib/data";

interface DesistenciasTableWithModalProps {
  rows: OptOutRow[];
}

export function DesistenciasTableWithModal({ rows }: DesistenciasTableWithModalProps) {
  const [detailTrip, setDetailTrip] = useState<TripRow | null>(null);
  const [driverRateConfig, setDriverRateConfig] = useState<DriverRateConfigRow | null>(null);
  const [loadingTripId, setLoadingTripId] = useState<number | null>(null);

  const handleRowClick = async (r: OptOutRow) => {
    if (r.trip_id == null || r.trip_id < 1) return;
    setLoadingTripId(r.trip_id);
    setDetailTrip(null);
    setDriverRateConfig(null);
    try {
      const res = await fetch(`/api/trips/${r.trip_id}`);
      if (!res.ok) return;
      const data = await res.json();
      setDetailTrip(data.trip ?? null);
      setDriverRateConfig(data.driverRateConfig ?? null);
    } catch {
      // ignore
    } finally {
      setLoadingTripId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registros</CardTitle>
          <CardDescription>Lista ordenada por data (mais recente primeiro). Clique em uma linha com viagem vinculada para ver os detalhes.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-4 md:p-6">
          <div className="min-w-[640px] overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Data / Hora</TableHead>
                  <TableHead className="whitespace-nowrap">Cliente</TableHead>
                  <TableHead className="whitespace-nowrap">Modelo do celular</TableHead>
                  <TableHead className="whitespace-nowrap">Versão app</TableHead>
                  <TableHead className="whitespace-nowrap">App origem</TableHead>
                  <TableHead className="whitespace-nowrap">Viagem (rota + app + data)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhuma desistência registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow
                      key={r.id}
                      className={
                        r.trip_id != null && r.trip_id > 0
                          ? "cursor-pointer hover:bg-muted/50"
                          : ""
                      }
                      onClick={() => r.trip_id != null && r.trip_id > 0 && handleRowClick(r)}
                    >
                      <TableCell className="whitespace-nowrap text-sm">
                        {r.occurred_at ? formatDateTimeBR(r.occurred_at) : r.created_at ? formatDateTimeBR(r.created_at) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-sm font-medium" title={r.client_name ?? ""}>
                        {r.client_name ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm" title={r.device_model ?? ""}>
                        {deviceModelDisplay(r.device_model)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{r.app_version ?? "—"}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{r.app_name ?? "—"}</TableCell>
                      <TableCell className="max-w-[280px] text-sm text-muted-foreground">
                        {r.trip_id != null && (r.trip_origin != null || r.trip_destination != null) ? (
                          <span title={`${r.trip_origin ?? ""} → ${r.trip_destination ?? ""}`}>
                            {loadingTripId === r.trip_id ? "Carregando…" : [r.trip_origin, r.trip_destination].filter(Boolean).join(" → ")}
                            {r.trip_app ? ` · ${r.trip_app}` : ""}
                            {r.trip_created_at ? ` · ${formatDateTimeBR(r.trip_created_at)}` : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TripDetailModal
        row={detailTrip}
        onClose={() => {
          setDetailTrip(null);
          setDriverRateConfig(null);
        }}
        driverRateConfig={driverRateConfig ?? undefined}
      />
    </>
  );
}
