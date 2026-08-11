import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient } from '@tanstack/react-query'
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnWindowFocus: true,
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// --- Ozcar-dev's formatters (event details) ---
export const formatDate = (iso: string) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export const formatTime = (iso: string) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

export const formatPrice = (price: number) => {
  if (price === 0) return 'Free'
  return `₦${price.toLocaleString()}`
}

// --- Chloe's formatters (restored after merge) ---
export const formatDateTime = (eventDateTime: string, displayFormat: string) => {
  return format(new Date(eventDateTime), displayFormat);
}

export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

const DAY_MS = 86_400_000;
const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

/** N days from today at the given hour, as an ISO string. */
export function daysFromNow(days: number, hour: number): string {
  const d = new Date(startOfToday.getTime() + days * DAY_MS);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** The coming Saturday at the given hour — for the "This weekend" window. */
export function thisWeekend(hour: number): string {
  const daysUntilSat = (6 - startOfToday.getDay() + 7) % 7;
  return daysFromNow(daysUntilSat, hour);
}

export const Format = {
  /**
   * Formats numbers into Nigerian Naira (₦) currency format or specified currency
   */
  amount: (value: number, currency: string = "NGN"): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  },

  /**
   * Formats ISO date strings or Date objects into human-readable format (e.g. "Sat, Nov 18")
   */
  date: (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  },

  /**
   * Formats time into 12-hour AM/PM string (e.g. "8:00 PM")
   */
  time: (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  },

shortDate: (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }); // → "Fri 20 Feb"
},

shortLocation: (location: string) => {
  // Returns just the venue name, before the comma
  return location.split(",")[0].trim(); // "V.I. Rooftop, Lagos" → "V.I. Rooftop"
},
};