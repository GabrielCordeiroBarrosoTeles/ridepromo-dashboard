"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripsPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Base path for page links (e.g. "/viagens"). If not set, relative "?" is used. */
  basePath?: string;
}

export function TripsPagination({ currentPage, totalPages, total, pageSize, basePath = "" }: TripsPaginationProps) {
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  const prevHref = currentPage === 2 ? (basePath || "?page=1") : `${basePath ? basePath + "?" : "?"}page=${currentPage - 1}`;
  const nextHref = `${basePath ? basePath + (basePath.includes("?") ? "&" : "?") : "?"}page=${currentPage + 1}`;

  return (
    <div className="flex flex-col items-center gap-3 border-t pt-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Exibindo <strong>{from}–{to}</strong> de <strong>{total}</strong> viagens
      </p>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={prevHref}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
        )}
        <span className="px-2 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={nextHref}>
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
