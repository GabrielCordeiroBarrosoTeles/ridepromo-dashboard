"use client";

import { useEffect } from "react";
import { X, Key, FileText, Calendar, MessageCircle } from "lucide-react";
import { formatDateTimeBR, formatConfigValue, isWhatsAppConfig, whatsappUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ConfigRow } from "@/lib/data";

interface ConfigDetailModalProps {
  row: ConfigRow | null;
  onClose: () => void;
}

function useModalEffects(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);
}

export function ConfigDetailModal({ row, onClose }: ConfigDetailModalProps) {
  useModalEffects(!!row, onClose);
  if (!row) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Detalhes da configuração</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fd6c13] focus:ring-offset-2"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-0 overflow-y-auto">
          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#fd6c13]">
              <Key className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Chave</p>
              <p className="mt-0.5 break-all font-mono text-sm font-medium text-gray-900">{row.key}</p>
            </div>
          </section>

          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Valor</p>
              <p className="mt-0.5 break-all font-mono text-sm text-gray-900">
                {formatConfigValue(row.key, row.value)}
              </p>
              {isWhatsAppConfig(row.key, row.value) && (
                <div className="mt-3">
                  <Button variant="whatsapp" size="sm" asChild>
                    <a
                      href={whatsappUrl(row.value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Abrir no WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Abrir no WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {row.description && (
            <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Descrição</p>
                <p className="mt-0.5 text-sm text-gray-600">{row.description}</p>
              </div>
            </section>
          )}

          <section className="flex gap-4 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Datas</p>
              <p className="mt-0.5 text-sm text-gray-600">
                Criado: {formatDateTimeBR(row.created_at)}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Atualizado: {formatDateTimeBR(row.updated_at)}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
