import { api } from './client'
import type { Category, EventDetail, EventSummary } from './types'

export type EventQuery = { q?: string; category?: string; type?: 'free' | 'paid'; page?: number }

type EventsBody = {
  events: EventSummary[]
  currency?: EventSummary['currency']
  meta: { total: number; hasMore: boolean; currentPage: number }
}

export async function fetchEvents(query: EventQuery = {}) {
  const p = new URLSearchParams()
  if (query.q) p.set('q', query.q)
  if (query.category) p.set('category', query.category)
  if (query.type) p.set('type', query.type)
  p.set('page', String(query.page ?? 1))
  p.set('limit', '12')
  const body = await api.get<EventsBody>(`/events?${p}`)
  return {
    // Prices are already converted server-side into body.currency.
    events: body.events.map((e) => ({ ...e, currency: body.currency ?? e.currency })),
    hasMore: body.meta.hasMore,
  }
}

export async function fetchEvent(slug: string) {
  const body = await api.get<EventDetail & { currency?: EventSummary['currency'] }>(`/events/${slug}`)
  return body
}

export const fetchCategories = () => api.get<Category[]>('/categories')
