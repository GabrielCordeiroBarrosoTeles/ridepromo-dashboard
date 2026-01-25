import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/** Chaves que são telefone/WhatsApp: máscara de telefone BR. */
const PHONE_CONFIG_KEYS = ["whatsapp", "phone", "telefone"];

/** Máscara de telefone BR: +55 (85) 91272-2350 (celular) ou +55 (85) 9127-2235 (fixo). */
export function formatPhoneBR(value: string): string {
  if (value == null || value === "") return "—";
  
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return value.trim();
  
  const withCountry = digits.length <= 11 ? `55${digits}` : digits;
  
  if (withCountry.length === 12) {
    return `+55 (${withCountry.slice(2, 4)}) ${withCountry.slice(4, 8)}-${withCountry.slice(8)}`;
  }
  
  if (withCountry.length >= 13) {
    return `+55 (${withCountry.slice(2, 4)}) ${withCountry.slice(4, 9)}-${withCountry.slice(9, 13)}`;
  }
  
  return value.trim();
}

/** Formata valor de config para exibição: número vira R$ 1,80; telefone vira máscara BR. */
export function formatConfigValue(key: string, value: string): string {
  if (value == null || value === "") return "—";
  
  const trimmed = value.trim();
  const k = (key || "").toLowerCase();
  
  if (PHONE_CONFIG_KEYS.some((p) => k.includes(p))) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length >= 10 ? formatPhoneBR(trimmed) : trimmed;
  }
  
  const num = parseFloat(trimmed.replace(",", "."));
  if (!Number.isNaN(num) && Number.isFinite(num)) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  }
  
  return trimmed;
}

/** Indica se a config é de WhatsApp e o valor parece número de telefone (para mostrar link). */
export function isWhatsAppConfig(key: string, value: string): boolean {
  if (!key || !value) return false;
  const k = key.toLowerCase();
  if (!k.includes("whatsapp")) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** Offset de Brasília em relação ao UTC (sempre -3h; Brasil não usa DST desde 2019). */
const BRASILIA_UTC_OFFSET_MS = -3 * 60 * 60 * 1000;

/** Garante que a string ISO seja interpretada como UTC (Supabase/Postgres retorna em UTC). */
function parseAsUTC(iso: string): number {
  const trimmed = iso.trim();
  if (trimmed.endsWith("Z") || trimmed.endsWith("+00:00") || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return new Date(trimmed).getTime();
  }
  const withoutMs = trimmed.split(".")[0].replace("Z", "").replace("+00:00", "");
  return new Date(withoutMs + "Z").getTime();
}

/**
 * Formata data/hora em Brasília (UTC-3), igual ao app Android.
 * Supabase retorna created_at em UTC; convertemos para Brasília.
 */
export function formatDateTimeBR(s: string | null): string {
  if (!s) return "—";
  
  try {
    const utcMs = parseAsUTC(s);
    if (Number.isNaN(utcMs)) return "—";
    
    const brasiliaMs = utcMs + BRASILIA_UTC_OFFSET_MS;
    const b = new Date(brasiliaMs);
    
    const day = String(b.getUTCDate()).padStart(2, "0");
    const month = String(b.getUTCMonth() + 1).padStart(2, "0");
    const year = b.getUTCFullYear();
    const hour = String(b.getUTCHours()).padStart(2, "0");
    const minute = String(b.getUTCMinutes()).padStart(2, "0");
    
    return `${day}/${month}/${year}, ${hour}:${minute}`;
  } catch (error) {
    console.warn("Error formatting date:", { input: s, error: error instanceof Error ? error.message : "Unknown error" });
    return "—";
  }
}

/** Formata apenas data em Brasília (UTC-3). */
export function formatDateBR(s: string | null): string {
  if (!s) return "—";
  
  try {
    const utcMs = parseAsUTC(s);
    if (Number.isNaN(utcMs)) return "—";
    
    const brasiliaMs = utcMs + BRASILIA_UTC_OFFSET_MS;
    const b = new Date(brasiliaMs);
    
    const day = String(b.getUTCDate()).padStart(2, "0");
    const month = String(b.getUTCMonth() + 1).padStart(2, "0");
    const year = b.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn("Error formatting date:", { input: s, error: error instanceof Error ? error.message : "Unknown error" });
    return "—";
  }
}

export function whatsappUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length <= 10 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}

/** Mapeamento de códigos de modelo (ex.: SM-S928B) para nome legível (ex.: S24 Ultra, Z Flip 5). */
const DEVICE_MODEL_DISPLAY: Record<string, string> = {
  "SM-S928B": "S24 Ultra",
  "SM-S928U": "S24 Ultra",
  "SM-S911B": "S24",
  "SM-S918B": "S23 Ultra",
  "SM-S911U": "S24",
  "SM-F721B": "Z Flip 5",
  "SM-F721U": "Z Flip 5",
  "SM-F946B": "Z Fold 5",
  "SM-F731B": "Z Flip 4",
  "SM-F936B": "Z Fold 4",
  "SM-A546B": "A54",
  "SM-A346B": "A34",
  "SM-G998B": "S21 Ultra",
  "SM-G991B": "S21",
};

/** Retorna nome legível do modelo do celular (ex.: S24 Ultra, Z Flip 5) ou o código original. */
export function deviceModelDisplay(model: string | null | undefined): string {
  if (model == null || model.trim() === "") return "—";
  
  const key = model.trim();
  return DEVICE_MODEL_DISPLAY[key] ?? key;
}
