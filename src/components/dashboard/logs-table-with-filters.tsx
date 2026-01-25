"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTimeBR } from "@/lib/utils";
import { LogDetailModal } from "./log-detail-modal";
import type { AppLogRow } from "@/lib/data";

/** Nome do evento para o usuário (em vez de código técnico). */
const EVENT_LABELS: Record<string, string> = {
  AUTH_001: "Login sucesso",
  AUTH_002: "Login falha",
  AUTH_003: "Logout",
  AUTH_004: "Cadastro sucesso",
  AUTH_005: "Cadastro falha",
  NET_001: "API sucesso",
  NET_002: "API falha",
  NET_003: "Supabase sucesso",
  NET_004: "Supabase falha",
  PROFILE_001: "Foto de perfil carregada",
  PROFILE_002: "Foto de perfil falha",
  APP_001: "App iniciado",
  ERR_001: "Erro geral",
};

/** Eventos de sucesso = verde; falha/erro = vermelho; resto = neutro. */
const EVENT_SUCCESS = new Set(["AUTH_001", "AUTH_004", "NET_001", "NET_003", "PROFILE_001", "APP_001"]);
const EVENT_FAILURE = new Set(["AUTH_002", "AUTH_005", "NET_002", "NET_004", "PROFILE_002", "ERR_001"]);

function eventLabel(logCode: string): string {
  return EVENT_LABELS[logCode] ?? logCode;
}

function eventVariant(logCode: string): "success" | "failure" | "neutral" {
  if (EVENT_SUCCESS.has(logCode)) return "success";
  if (EVENT_FAILURE.has(logCode)) return "failure";
  return "neutral";
}

/** Formata metadata (ex: motivo de falha) para exibição legível (exclui device_model e app_version). */
function formatMetadata(metadata: Record<string, unknown> | null): string {
  if (!metadata || typeof metadata !== "object") return "—";
  const parts = Object.entries(metadata)
    .filter(([k]) => k !== "device_model" && k !== "app_version")
    .map(([k, v]) => `${k}: ${String(v)}`);
  return parts.length ? parts.join(" · ") : "—";
}

function metaStr(metadata: Record<string, unknown> | null, key: string): string {
  if (!metadata || typeof metadata !== "object") return "—";
  const v = metadata[key];
  return v != null && String(v).trim() !== "" ? String(v).trim() : "—";
}

interface LogsTableWithFiltersProps {
  logs: AppLogRow[];
  userNameByUserId: Record<string, string>;
  userPhoneByUserId: Record<string, string>;
  tripCountByUserId: Record<string, number>;
}

export function LogsTableWithFilters({
  logs,
  userNameByUserId,
  userPhoneByUserId,
  tripCountByUserId,
}: LogsTableWithFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterUsuario, setFilterUsuario] = useState("");
  const [selectedLog, setSelectedLog] = useState<AppLogRow | null>(null);

  const filtered = useMemo(() => {
    const q = filterUsuario.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((row) => {
      const name = (row.user_id ? userNameByUserId[row.user_id] : null) ?? "";
      return name.toLowerCase().includes(q);
    });
  }, [logs, filterUsuario, userNameByUserId]);

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
        <label className="sr-only" htmlFor="logs-filter-usuario">
          Usuário
        </label>
        <input
          id="logs-filter-usuario"
          type="text"
          placeholder="Buscar por nome do usuário..."
          value={filterUsuario}
          onChange={(e) => setFilterUsuario(e.target.value)}
          className="min-w-[180px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          className="ml-auto bg-white text-[#fd6c13] border-white/80 hover:bg-white/95 hover:text-[#e55c0a]"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Atualizando…" : "Atualizar"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead className="w-[80px] text-right">Qtd</TableHead>
            <TableHead className="hidden sm:table-cell max-w-[180px]">Usuário</TableHead>
            <TableHead className="min-w-[140px]">Data/hora (BR)</TableHead>
            <TableHead className="hidden lg:table-cell max-w-[140px]">Modelo</TableHead>
            <TableHead className="hidden lg:table-cell w-[90px]">Versão</TableHead>
            <TableHead className="hidden md:table-cell max-w-[180px]" title="Info extra (ex: motivo de falha)">
              Detalhes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                {logs.length === 0
                  ? "Nenhum log encontrado. Verifique se a tabela app_logs existe no Supabase e se o app já enviou logs."
                  : "Nenhum log corresponde ao filtro."}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row) => {
              const variant = eventVariant(row.log_code);
              const eventCellClass =
                variant === "success"
                  ? "font-medium text-green-700 bg-green-50"
                  : variant === "failure"
                    ? "font-medium text-red-700 bg-red-50"
                    : "font-medium";
              const deviceModel = metaStr(row.metadata, "device_model");
              const appVersion = metaStr(row.metadata, "app_version");
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedLog(row)}
                >
                  <TableCell className={eventCellClass}>{eventLabel(row.log_code)}</TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="hidden max-w-[180px] truncate sm:table-cell" title={row.user_id ? userNameByUserId[row.user_id] ?? row.user_id : ""}>
                    {row.user_id ? (userNameByUserId[row.user_id]?.trim() || "—") : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{formatDateTimeBR(row.created_at)}</TableCell>
                  <TableCell className="hidden max-w-[140px] truncate lg:table-cell text-xs text-muted-foreground" title={deviceModel}>
                    {deviceModel}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{appVersion}</TableCell>
                  <TableCell className="hidden max-w-[180px] truncate md:table-cell text-xs text-muted-foreground" title={row.metadata ? formatMetadata(row.metadata) : ""}>
                    {row.metadata ? formatMetadata(row.metadata) : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <LogDetailModal
        row={selectedLog}
        userNameByUserId={userNameByUserId}
        userPhoneByUserId={userPhoneByUserId}
        tripCountByUserId={tripCountByUserId}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
