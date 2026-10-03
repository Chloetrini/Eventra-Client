import { api } from './client'
import type { Currency } from './types'

export type Period = '7d' | '30d' | '1m'

export type Overview = {
  ticketsSold: number
  ticketsSoldChangePct: number | null
  revenue: number
  revenueChangePct: number | null
  liveEventsCount: number
  payoutDue: number
  nextPayoutInDays: number | null
  recentEvents: {
    _id: string; title: string; slug: string; coverImage?: string; category?: string
    startDate: string; soldCount: number; capacity: number | null; status: string; statusLabel: string
  }[]
  revenueSeries: { label: string; amount: number }[]
  ticketsByType: { name: string; count: number; percentage: number }[]
  currency?: Currency
}

export const fetchOverview = (period: Period) => api.get<Overview>(`/organizers/overview?period=${period}`)

export type OrganizerProfile = { businessName?: string; approvalStatus?: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'; isPayoutReady?: boolean } | null
export const fetchProfile = () => api.get<OrganizerProfile>('/organizers/profile')

export type MyEvent = {
  _id: string; title?: string; slug: string; type: 'free' | 'paid'; status: string
  coverImage?: string; startDate?: string; endDate?: string; capacity?: number | null
  reservationsCount?: number; ticketsSoldCount?: number; revenueTotal?: number
  category?: { name?: string } | string | null
}

export async function fetchMyEvents() {
  const body = await api.get<{ events: MyEvent[]; currency?: Currency }>('/events/mine?limit=100')
  return { events: body.events, currency: body.currency }
}

/** Same display status the website shows. */
export function eventStatus(e: Pick<MyEvent, 'status' | 'type' | 'capacity' | 'reservationsCount' | 'ticketsSoldCount' | 'startDate' | 'endDate'>) {
  const s = e.status.toLowerCase()
  if (s === 'draft') return 'Draft'
  if (s === 'pending_approval' || s === 'pending') return 'Pending'
  if (s === 'rejected') return 'Rejected'
  if (s === 'cancelled') return 'Cancelled'
  if (s === 'postponed') return 'Postponed'
  if (s !== 'approved') return 'Past'
  const sold = e.type === 'free' ? e.reservationsCount ?? 0 : e.ticketsSoldCount ?? 0
  if (e.capacity != null && sold >= e.capacity) return 'Sold out'
  const ends = e.endDate ?? e.startDate
  if (ends && new Date(ends).getTime() < Date.now()) return 'Past'
  return 'Live'
}

export type Attendee = {
  _id: string; code: string; ticketId: string; type: 'free' | 'paid'; price: number
  attendeeName: string; attendeeEmail: string
  status: 'valid' | 'checked_in' | 'cancelled' | 'refunded'
  checkedInAt?: string | null; ticketType?: { name: string } | null
}

export const fetchAttendees = (eventId: string) =>
  api.get<{ tickets: Attendee[]; stats: { total: number; checkedIn: number; notIn: number } }>(`/events/${eventId}/attendees?limit=500`)

export const checkIn = (eventId: string, code: string) =>
  api.post<{ result: 'valid' | 'already_used' | 'invalid'; checkedInAt?: string | null; ticket?: Attendee }>(
    `/events/${eventId}/check-in`, { code },
  )

export type EventDashboard = {
  event: { _id?: string; title: string; slug: string; status: string; type: 'free' | 'paid'; startDate?: string; venue?: { name: string; city: string }; isOnline?: boolean; coverImage?: string }
  reservationsCount?: number; capacity: number | null; ticketsSoldCount?: number; revenueTotal?: number; currency?: Currency
}
export const fetchEventDashboard = (id: string) => api.get<EventDashboard>(`/events/${id}/dashboard`)

export const submitEvent = (id: string) => api.post(`/events/${id}/submit`)
export const duplicateEvent = (id: string) => api.post<{ _id: string }>(`/events/${id}/duplicate`)

export type Payouts = {
  earningsByEvent: { eventId: string; eventTitle: string; grossSales: number; commission: number; earnings: number; status: 'held' | 'ready' | 'paid' | 'free_no_payout' }[]
  payoutHistory: { date: string; amount: number; bankLabel: string | null }[]
  currency?: Currency
}
export const fetchPayouts = () => api.get<Payouts>('/organizers/payouts')

// ---- create / edit event -------------------------------------------------
export type EventDraft = {
  type: 'free' | 'paid'
  title?: string; description?: string; category?: string; coverImage?: string
  venue?: { name: string; address: string; city: string; state?: string }
  isOnline?: boolean; onlineJoinLink?: string
  startDate?: string; endDate?: string; capacity?: number
  refundPolicy?: { type: 'no-refunds' | 'refund-until-days-before'; daysBefore?: number }
}
export const createEventDraft = (d: EventDraft) => api.post<{ _id: string }>('/events', d)
export const updateEvent = (id: string, d: Partial<EventDraft>) => api.patch(`/events/${id}`, d)
export const createTicketType = (eventId: string, t: { name: string; price: number; quantity: number; currency?: Currency }) =>
  api.post(`/events/${eventId}/ticket-types`, t)

export async function uploadCover(uri: string, mime = 'image/jpeg') {
  const form = new FormData()
  // React Native's FormData accepts a { uri, name, type } file descriptor.
  form.append('image', { uri, name: `cover.${mime.split('/')[1] ?? 'jpg'}`, type: mime } as unknown as Blob)
  const body = await api.upload<{ url?: string; imageUrl?: string; coverImage?: string }>('/uploads/event-cover', form)
  return body.url ?? body.imageUrl ?? body.coverImage ?? ''
}
