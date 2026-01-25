"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatConfigValue } from "@/lib/utils";
import { ConfigDetailModal } from "./config-detail-modal";
import type { ConfigRow } from "@/lib/data";

interface ConfigsTableWithModalProps {
  configs: ConfigRow[];
}

export function ConfigsTableWithModal({ configs }: ConfigsTableWithModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterKey, setFilterKey] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<ConfigRow | null>(null);

  const filtered = useMemo(() => {
    const q = filterKey.trim().toLowerCase();
    if (!q) return configs;
    return configs.filter(
      (row) =>
        row.key.toLowerCase().includes(q) ||
        (row.value ?? "").toLowerCase().includes(q) ||
        (row.description ?? "").toLowerCase().includes(q)
    );
  }, [configs, filterKey]);

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Filtrar por chave, valor ou descrição..."
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value)}
          className="h-9 max-w-xs rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-[#fd6c13] focus:outline-none focus:ring-1 focus:ring-[#fd6c13]"
          aria-label="Filtrar configurações"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} aria-hidden />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">Chave</TableHead>
              <TableHead className="font-semibold text-gray-700">Valor</TableHead>
              <TableHead className="hidden font-semibold text-gray-700 sm:table-cell">Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                  Nenhuma configuração encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow
                  key={row.key}
                  className="cursor-pointer transition hover:bg-amber-50/50"
                  onClick={() => setSelectedConfig(row)}
                >
                  <TableCell className="font-mono text-sm font-medium text-gray-900">
                    {row.key}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-mono text-sm text-gray-600 sm:max-w-[280px]">
                    {formatConfigValue(row.key, row.value)}
                  </TableCell>
                  <TableCell className="hidden max-w-[240px] truncate text-sm text-gray-500 sm:table-cell">
                    {row.description ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfigDetailModal row={selectedConfig} onClose={() => setSelectedConfig(null)} />
    </div>
  );
}
