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
