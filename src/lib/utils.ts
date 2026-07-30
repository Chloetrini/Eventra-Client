import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient} from '@tanstack/react-query'
import {format} from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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


const DAY_MS = 86_400_000;
const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());


export function daysFromNow(days: number, hour: number): string {
  const d = new Date(startOfToday.getTime() + days * DAY_MS);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function thisWeekend(hour: number): string {
  const daysUntilSat = (6 - startOfToday.getDay() + 7) % 7;
  return daysFromNow(daysUntilSat, hour);
}

export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export const formatDateTime = (eventDateTime: string, displayFormat:string) => {

  const [hours, minutes] = eventDateTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes);

  return format(new Date(eventDateTime), displayFormat);

}