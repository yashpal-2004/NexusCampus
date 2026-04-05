import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureMillis(date: any): number {
  if (!date) return Date.now();
  if (typeof date === 'number') return date;
  if (date instanceof Date) return date.getTime();
  if (typeof date.toMillis === 'function') return date.toMillis();
  if (typeof date.toDate === 'function') return date.toDate().getTime();
  if (date.seconds !== undefined) return date.seconds * 1000 + (date.nanoseconds || 0) / 1000000;
  return Date.now();
}
