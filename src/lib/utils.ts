import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient} from '@tanstack/react-query'

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

// export const formatFollowers = (n: number) => {
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
//   return String(n)
// }