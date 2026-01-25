"use client";

import { useEffect } from "react";
import { X, User, CalendarClock, Smartphone, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTimeBR, whatsappUrl } from "@/lib/utils";
import type { AppLogRow } from "@/lib/data";

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

function eventLabel(logCode: string): string {
  return EVENT_LABELS[logCode] ?? logCode;
}

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

interface LogDetailModalProps {
  row: AppLogRow | null;
  userNameByUserId: Record<string, string>;
  userPhoneByUserId: Record<string, string>;
  tripCountByUserId: Record<string, number>;
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

export function LogDetailModal({
  row,
  userNameByUserId,
  userPhoneByUserId,
  tripCountByUserId,
  onClose,
}: LogDetailModalProps) {
  useModalEffects(!!row, onClose);
  if (!row) return null;

  const userName = row.user_id ? userNameByUserId[row.user_id]?.trim() || "—" : "—";
  const userPhone = row.user_id ? userPhoneByUserId[row.user_id] : null;
  const tripCount = row.user_id ? (tripCountByUserId[row.user_id] ?? 0) : 0;
  const deviceModel = metaStr(row.metadata, "device_model");
  const appVersion = metaStr(row.metadata, "app_version");
  const details = formatMetadata(row.metadata);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Detalhes do log</h2>
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
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{eventLabel(row.log_code)}</p>
              <p className="text-sm text-gray-500">Quantidade: {row.count}</p>
              <p className="mt-1 text-sm text-gray-600">{formatDateTimeBR(row.created_at)}</p>
            </div>
          </section>

          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">Cliente</p>
              <p className="text-sm text-gray-600">{userName}</p>
              <p className="mt-1 text-sm font-medium text-[#2d682a]">Total de viagens no app: {tripCount}</p>
              {userPhone && (
                <div className="mt-2">
                  <Button variant="whatsapp" size="sm" asChild>
                    <a href={whatsappUrl(userPhone)} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                      Ir para WhatsApp
                    </a>
                  </Button>
                </div>
              )}
              {!userPhone && row.user_id && (
                <p className="mt-1 text-xs text-muted-foreground">Telefone não cadastrado</p>
              )}
            </div>
          </section>

          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">Dispositivo</p>
              <p className="text-sm text-gray-600">Modelo: {deviceModel}</p>
              <p className="text-sm text-gray-600">Versão do app: {appVersion}</p>
            </div>
          </section>

          {details !== "—" && (
            <section className="flex gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Detalhes</p>
                <p className="text-sm text-gray-600">{details}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
