"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBRL, whatsappUrl } from "@/lib/utils";
import type { TripRow } from "@/types/dashboard";

interface TripsTableProps {
  rows: TripRow[];
}

export function TripsTable({ rows }: TripsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden sm:table-cell">Origem / Destino</TableHead>
          <TableHead>Valor app</TableHead>
          <TableHead>Valor c/ desconto</TableHead>
          <TableHead className="w-[100px]">WhatsApp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              Nenhuma viagem encontrada.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                <span className="block truncate" title={`${r.origin ?? ""} → ${r.destination ?? ""}`}>
                  {r.origin ?? "—"} → {r.destination ?? "—"}
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
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
