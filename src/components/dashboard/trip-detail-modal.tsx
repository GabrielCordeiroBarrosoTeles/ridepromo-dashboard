"use client";

import { useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Smartphone,
  CalendarClock,
  Car,
  Bike,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import { formatBRL, whatsappUrl } from "@/lib/utils";
import type { TripRow } from "@/types/dashboard";

interface TripDetailModalProps {
  row: TripRow | null;
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

function formatDateTime(s: string | null): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function rideIcon(name: string | null) {
  const n = (name ?? "").toLowerCase();
  if (n.includes("moto")) return <Bike className="h-4 w-4 text-[#2d682a]" />;
  return <Car className="h-4 w-4 text-[#fd6c13]" />;
}

export function TripDetailModal({ row, onClose }: TripDetailModalProps) {
  useModalEffects(!!row, onClose);
  if (!row) return null;

  const { name, phone, origin, destination, app, valorApp, valorComDesconto, discountPercent, createdAt, rides } = row;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Detalhes da viagem</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fd6c13] focus:ring-offset-2"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-0 overflow-y-auto">
          {/* Cliente */}
          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#fd6c13]">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Cliente</p>
              <p className="mt-0.5 font-medium text-gray-900">{name}</p>
              {phone ? (
                <a
                  href={whatsappUrl(phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#2d682a] hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  {phone}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-400">Sem telefone</p>
              )}
            </div>
          </section>

          {/* Rota */}
          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Rota</p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">{origin || "—"}</span>
                <span className="mx-2 text-gray-300">→</span>
                <span className="font-medium">{destination || "—"}</span>
              </p>
            </div>
          </section>

          {/* App e data */}
          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">App</p>
              <p className="mt-1 font-medium text-gray-900">{app || "—"}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Data e hora</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{formatDateTime(createdAt)}</p>
            </div>
          </section>

          {/* Resumo de valores: Valor no app = menor preço entre as opções; Com desconto = usando discount_percent salvo (9–11%) */}
          <section className="flex gap-4 border-b border-gray-50 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Valor no app{rides?.length > 1 ? " (menor)" : ""}
                </p>
                <p className="font-semibold text-gray-900">{formatBRL(valorApp)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Com desconto ({discountPercent != null ? `${discountPercent}%` : "20% (estimado)"})
                </p>
                <p className="font-semibold text-[#2d682a]">{formatBRL(valorComDesconto)}</p>
              </div>
            </div>
          </section>

          {/* Opções de viagem */}
          <section className="px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Opções de viagem</p>
            {!rides?.length ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-center text-sm text-gray-500">
                Nenhuma opção registrada
              </p>
            ) : (
              <ul className="space-y-2">
                {rides.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 transition hover:border-gray-200 hover:bg-gray-50/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      {rideIcon(r.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{r.name || r.type || "—"}</p>
                      {r.estimatedTime && (
                        <p className="text-xs text-gray-500">{r.estimatedTime}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{r.price || (r.value != null ? formatBRL(r.value) : "—")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#fd6c13] px-4 py-2.5 font-medium text-white transition hover:bg-[#e55f0f] focus:outline-none focus:ring-2 focus:ring-[#fd6c13] focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
