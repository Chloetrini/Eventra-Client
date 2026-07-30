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

export const formatDateTime = (
  eventDateTime: string,
  displayFormat: string,
) => {
  const [hours, minutes] = eventDateTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes);

  return format(new Date(eventDateTime), displayFormat);
};

export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
