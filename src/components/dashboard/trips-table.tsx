"use client";

import { useState } from "react";
import { MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBRL, whatsappUrl } from "@/lib/utils";
import { TripDetailModal } from "./trip-detail-modal";
import type { TripRow } from "@/types/dashboard";

interface TripsTableProps {
  rows: TripRow[];
}

export function TripsTable({ rows }: TripsTableProps) {
  const [detailRow, setDetailRow] = useState<TripRow | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Origem / Destino</TableHead>
            <TableHead>Valor app</TableHead>
            <TableHead>Valor c/ desconto</TableHead>
            <TableHead className="w-[100px]">WhatsApp</TableHead>
            <TableHead className="w-[80px] text-right">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                <span className="block">Nenhuma viagem encontrada.</span>
                <span className="mt-1 block text-xs">
                  Os dados vêm do Supabase (trips, ride_options, users). Se esperava ver viagens, acesse{" "}
                  <a href="/api/supabase-status" className="underline">/api/supabase-status</a> para conferir a conexão.
                </span>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                  <span className="block truncate" title={`${r.origin?.trim() || ""} → ${r.destination?.trim() || ""}`}>
                    {r.origin?.trim() || "—"} → {r.destination?.trim() || "—"}
                  </span>
                </TableCell>
                <TableCell>{formatBRL(r.valorApp)}</TableCell>
                <TableCell className="text-app-green font-medium">{formatBRL(r.valorComDesconto)}</TableCell>
                <TableCell>
                  {r.phone ? (
                    <Button variant="whatsapp" size="sm" asChild>
                      <a href={whatsappUrl(r.phone)} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Zap</span>
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailRow(r)}
                    className="text-gray-500 hover:bg-amber-50 hover:text-[#fd6c13]"
                    aria-label="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TripDetailModal row={detailRow} onClose={() => setDetailRow(null)} />
    </>
  );
}
