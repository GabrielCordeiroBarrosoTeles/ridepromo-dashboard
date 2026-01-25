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
  Gauge,
  Route,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatBRL, formatDateTimeBR, whatsappUrl } from "@/lib/utils";
import type { TripRow, RideOptionRow } from "@/types/dashboard";
import type { DriverRateConfigRow } from "@/lib/data";

interface TripDetailModalProps {
  row: TripRow | null;
  onClose: () => void;
  driverRateConfig?: DriverRateConfigRow;
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

function rideIcon(name: string | null) {
  const n = (name ?? "").toLowerCase();
  if (n.includes("moto")) return <Bike className="h-4 w-4 text-[#2d682a]" />;
  return <Car className="h-4 w-4 text-[#fd6c13]" />;
}

function hasDriverRateInfo(r: RideOptionRow): boolean {
  return (
    r.driverValuePerKm != null ||
    r.driverValuePerHour != null ||
    r.pickupKm != null ||
    r.tripKm != null ||
    r.totalKm != null ||
    r.pickupMin != null ||
    r.tripDurationMin != null ||
    r.totalMin != null ||
    r.meetsMinPerKm != null ||
    r.meetsMinPerHour != null
  );
}

function isMotoRide(r: RideOptionRow): boolean {
  const n = ((r.name ?? "") + " " + (r.type ?? "")).toLowerCase();
  return n.includes("moto");
}

function RideDriverRateBlock({ r, driverRateConfig }: { r: RideOptionRow; driverRateConfig?: DriverRateConfigRow }) {
  if (!hasDriverRateInfo(r)) return null;
  const isMoto = isMotoRide(r);
  const minPerKm = driverRateConfig ? (isMoto ? driverRateConfig.minPerKmMoto : driverRateConfig.minPerKmCar) : null;
  const minPerHour = driverRateConfig ? (isMoto ? driverRateConfig.minPerHourMoto : driverRateConfig.minPerHourCar) : null;
  return (
    <div className="mt-3 rounded-lg border border-gray-100 bg-white/80 p-3 text-xs">
      <p className="mb-2 flex items-center gap-1.5 font-medium uppercase tracking-wider text-gray-500">
        <Gauge className="h-3.5 w-3.5" />
        Taxa do motorista
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(r.driverValuePerKm != null || r.driverValuePerHour != null) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {r.driverValuePerKm != null && (
              <span><strong className="text-gray-600">R$/km:</strong> {formatBRL(r.driverValuePerKm)}</span>
            )}
            {r.driverValuePerHour != null && (
              <span><strong className="text-gray-600">R$/h:</strong> {formatBRL(r.driverValuePerHour)}</span>
            )}
          </div>
        )}
        {(r.pickupKm != null || r.tripKm != null || r.totalKm != null) && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Route className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span>
              {r.pickupKm != null && <span>busca {r.pickupKm.toFixed(2)} km</span>}
              {r.pickupKm != null && (r.tripKm != null || r.totalKm != null) && " · "}
              {r.tripKm != null && <span>corrida {r.tripKm.toFixed(2)} km</span>}
              {r.tripKm != null && r.totalKm != null && " · "}
              {r.totalKm != null && <span>total {r.totalKm.toFixed(2)} km</span>}
            </span>
          </div>
        )}
        {(r.pickupMin != null || r.tripDurationMin != null || r.totalMin != null) && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span>
              {r.pickupMin != null && <span>busca {r.pickupMin} min</span>}
              {r.pickupMin != null && (r.tripDurationMin != null || r.totalMin != null) && " · "}
              {r.tripDurationMin != null && <span>corrida {r.tripDurationMin} min</span>}
              {r.tripDurationMin != null && r.totalMin != null && " · "}
              {r.totalMin != null && <span>total {r.totalMin} min</span>}
            </span>
          </div>
        )}
        {(r.meetsMinPerKm != null || r.meetsMinPerHour != null) && (
          <div className="flex flex-wrap gap-2">
            {r.meetsMinPerKm != null && (
              r.meetsMinPerKm ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Atende mín. R$/km{minPerKm != null ? ` (${formatBRL(minPerKm)})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                  <XCircle className="h-3 w-3" /> Abaixo mín. R$/km{minPerKm != null ? ` (mín. ${formatBRL(minPerKm)})` : ""}
                </span>
              )
            )}
            {r.meetsMinPerHour != null && (
              r.meetsMinPerHour ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Atende mín. R$/h{minPerHour != null ? ` (${formatBRL(minPerHour)})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                  <XCircle className="h-3 w-3" /> Abaixo mín. R$/h{minPerHour != null ? ` (mín. ${formatBRL(minPerHour)})` : ""}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TripDetailModal({ row, onClose, driverRateConfig }: TripDetailModalProps) {
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
              <p className="mt-1 text-sm font-medium text-gray-900">{formatDateTimeBR(createdAt)}</p>
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
                    className="rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 transition hover:border-gray-200 hover:bg-gray-50/60"
                  >
                    <div className="flex items-center gap-3">
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
                    </div>
                    <RideDriverRateBlock r={r} driverRateConfig={driverRateConfig} />
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
