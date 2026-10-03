import type { Currency, EventSummary } from '@/api/types'

const SYMBOL: Record<Currency, string> = { Naira: '₦', Dollar: '$', Cedis: 'GH₵', Pound: '£' }

export const money = (amount: number, currency: Currency = 'Naira') =>
  `${SYMBOL[currency]}${amount.toLocaleString('en-US')}`

export const priceLabel = (e: Pick<EventSummary, 'type' | 'minPrice' | 'currency'>) =>
  e.type === 'free' || e.minPrice === 0 ? 'Free' : `From ${money(e.minPrice, e.currency)}`

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export const venueLabel = (e: Pick<EventSummary, 'venue' | 'isOnline'>) =>
  e.venue ? [e.venue.name, e.venue.city].filter(Boolean).join(', ') : e.isOnline ? 'Online' : 'Venue TBA'

export const isUpcoming = (iso: string) => new Date(iso).getTime() > Date.now() - 12 * 60 * 60 * 1000

/** ₦1.2M / ₦45K style for dashboard tiles. */
export function compactMoney(amount: number, currency: Currency = 'Naira') {
  const sym = { Naira: '₦', Dollar: '$', Cedis: 'GH₵', Pound: '£' }[currency]
  const abs = Math.abs(amount)
  const n = abs >= 1e9 ? `${(abs / 1e9).toFixed(1)}B` : abs >= 1e6 ? `${(abs / 1e6).toFixed(1)}M` : abs >= 1e4 ? `${(abs / 1e3).toFixed(1)}K` : abs.toLocaleString('en-US')
  return `${amount < 0 ? '-' : ''}${sym}${n.replace('.0', '')}`
}

export const timeAgo = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.round(m / 60)}h ago`
  return `${Math.round(m / 1440)}d ago`
}
