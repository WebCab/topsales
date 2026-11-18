import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  priceInCents: number,
  options: {
    currency?: "USD" | "EUR" | "GBP";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "standard" } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(priceInCents / 100);
}

export function formatDate(timestampInSeconds: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestampInSeconds * 1000));
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}
