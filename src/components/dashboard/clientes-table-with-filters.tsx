"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { whatsappUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { ClienteRow } from "@/lib/data";

interface ClientesTableWithFiltersProps {
  clientes: ClienteRow[];
}

export function ClientesTableWithFilters({ clientes }: ClientesTableWithFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterNome, setFilterNome] = useState("");
  const [filterTelefone, setFilterTelefone] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const filtered = useMemo(() => {
    const n = filterNome.trim().toLowerCase();
    const t = filterTelefone.trim().toLowerCase();
    const e = filterEmail.trim().toLowerCase();
    return clientes.filter((c) => {
      if (n && !(c.name_user ?? "").toLowerCase().includes(n)) return false;
      if (t && !(c.phone ?? "").toLowerCase().includes(t)) return false;
      if (e && !(c.email ?? "").toLowerCase().includes(e)) return false;
      return true;
    });
  }, [clientes, filterNome, filterTelefone, filterEmail]);

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

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
        <input
          type="text"
          placeholder="Telefone..."
          value={filterTelefone}
          onChange={(e) => setFilterTelefone(e.target.value)}
          className="min-w-[100px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          placeholder="E-mail..."
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="min-w-[140px] rounded-md border bg-background px-3 py-1.5 text-sm"
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
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Telefone</TableHead>
            <TableHead className="hidden md:table-cell">E-mail</TableHead>
            <TableHead className="w-[90px] text-right">Viagens</TableHead>
            <TableHead className="w-[100px]">WhatsApp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {clientes.length === 0 ? "Nenhum cliente com login encontrado." : "Nenhum cliente corresponde aos filtros."}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((c) => (
              <TableRow key={c.id_user}>
                <TableCell className="font-medium">{c.name_user?.trim() || "—"}</TableCell>
                <TableCell className="hidden sm:table-cell">{c.phone?.trim() || "—"}</TableCell>
                <TableCell className="hidden max-w-[200px] truncate md:table-cell" title={c.email ?? ""}>
                  {c.email?.trim() || "—"}
                </TableCell>
                <TableCell className="text-right font-medium">{c.trip_count}</TableCell>
                <TableCell>
                  {c.phone?.trim() ? (
                    <Button variant="whatsapp" size="sm" asChild>
                      <a href={whatsappUrl(c.phone!)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
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
    </div>
  );
}
