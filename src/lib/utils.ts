import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function whatsappUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length <= 10 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}
