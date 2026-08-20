import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";
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
});

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
};

export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const formatCompactNaira = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return `${amount.toLocaleString("en-NG")}`;
};

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

// The bank-account "resolve" endpoint proxies Paystack's own error message
// straight through (see resolveBankAccount in organizer.controller.ts) —
// fine for a real validation error ("Invalid account number"), but
// Paystack's test-mode rate-limit message ("Test mode daily limit of 3 live
// bank resolves exceeded...") is internal Paystack/API jargon that shouldn't
// be shown to an organizer as-is. Swap that one specific case for plain
// language; every other message (the ones organizers can actually act on)
// passes through unchanged.
export function humanizeBankResolveError(message: string): string {
  if (/test mode/i.test(message) && /daily limit/i.test(message)) {
    return "We've hit today's test-mode verification limit for live bank codes. Try again tomorrow, use a Paystack test bank code (e.g. 001) for now, or switch Paystack to live mode.";
  }
  return message;
}

// The home page's "featured event" number badge (mobile hero card + desktop
// stacked carousel) used to show the full `event.no` value straight through
// — fine while `no` was a short code, but it can be a long backend-assigned
// number, and showing it in full looked cluttered on a small badge. This
// always trims to the last 4 characters (like the fallback-to-_id path
// already did), so the badge is always a short, fixed-width "No 0421" style
// tag no matter how long the underlying value is.
export function shortEventNo(event: { no?: string; _id: string }): string {
  const raw = event.no ?? event._id;
  return raw.slice(-4).padStart(4, "0").toUpperCase();
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
