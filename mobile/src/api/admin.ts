import { api } from './client'
import type { Currency } from './types'

export type AdminOverview = {
  currency?: Currency
  needsAction: {
    pendingEventsCount: number; organizersToVerifyCount: number; promotionsPendingCount: number
    pendingRefundsCount: number; refundsToInvestigateCount: number | null
  }
  stats: {
    grossTicketSales: number; platformRevenue: number; platformRevenueChangePct: number | null
    heldInEscrow: number; activeEventsCount: number; activeOrganizersCount: number; commissionRatePct: number
  }
  revenueSeries: { label: string; amount: number }[]
  trustAndSafety: { flaggedEventsCount: number; openPaymentDisputesCount: number; refundRate30d: number; newOrganizersToday: number }
  topOrganizers: { organizerId: string; businessName: string; grossSales: number }[]
  recentActivity: { id: string; type: string; message: string; actorName: string; createdAt: string }[]
}
export const fetchAdminOverview = (period = '30d') => api.get<AdminOverview>(`/admin/overview?period=${period}`)

export type NavCounts = { pendingApprovals: number; pendingRefunds: number; flaggedReports: number; unreadEnquiries: number }
export const fetchNavCounts = () => api.get<NavCounts>('/admin/nav-counts')

export type PendingOrganizer = {
  _id: string; fullname: string; email?: string
  organizerProfile?: { businessName?: string; category?: string; phone?: string; bio?: string; bankName?: string; accountName?: string; approvalStatus?: string }
}
export const fetchPendingOrganizers = async () => (await api.get<{ organizers: PendingOrganizer[] }>('/admin/organizers/pending')).organizers
export const approveOrganizer = (id: string) => api.patch(`/admin/organizers/${id}/approve`)
export const rejectOrganizer = (id: string, reason?: string) => api.patch(`/admin/organizers/${id}/reject`, { reason })

export type PendingEvent = {
  _id: string; title?: string; slug: string; type: 'free' | 'paid'; status: string; startDate?: string; createdAt: string
  capacity?: number; organizer?: { fullname: string; email?: string; organizerProfile?: { businessName?: string } }
}
export const fetchPendingEvents = async () => (await api.get<{ events: PendingEvent[] }>('/admin/events/pending')).events
export const approveEvent = (id: string) => api.patch(`/admin/events/${id}/approve`)
export const rejectEvent = (id: string, reason: string) => api.patch(`/admin/events/${id}/reject`, { reason })

export type RefundRequest = {
  _id: string; amount: number; reason: string; status: string; createdAt: string; currency?: Currency
  ticket: { attendeeName: string; attendeeEmail: string }; event: { _id: string; title: string; slug: string }
}
export async function fetchRefunds() {
  const body = await api.get<{ refundRequests: RefundRequest[]; currency?: Currency }>('/admin/refund-requests?limit=100')
  return body.refundRequests.map((r) => ({ ...r, currency: body.currency }))
}
export const approveRefund = (id: string) => api.patch(`/admin/refund-requests/${id}/approve`)
export const rejectRefund = (id: string, reason?: string) => api.patch(`/admin/refund-requests/${id}/reject`, { reason })

export type AdminUser = {
  _id: string; fullname: string; email: string; role: 'attendee' | 'organizer' | 'admin'
  isSuspended: boolean; isDeleted?: boolean; createdAt: string; ordersCount: number; totalSpent: number
}
export async function fetchUsers(p: { q?: string; page?: number }) {
  const s = new URLSearchParams({ page: String(p.page ?? 1), limit: '20' })
  if (p.q) s.set('q', p.q)
  return api.get<{ users: AdminUser[]; meta: { hasMore: boolean }; currency?: Currency }>(`/admin/users?${s}`)
}
export const suspendUser = (id: string) => api.patch(`/admin/users/${id}/suspend`)
export const unsuspendUser = (id: string) => api.patch(`/admin/users/${id}/unsuspend`)

export type PayoutOverview = {
  heldInEscrow: number; heldInEscrowEventsCount: number; readyToRelease: number
  paidOutAllTime: number; commissionCollected: number; currency?: Currency
}
export const fetchPayoutOverview = () => api.get<PayoutOverview>('/admin/payouts/overview')
export type AwaitingPayout = {
  organizerId: string; organizerName: string; eventId: string; eventTitle: string
  amount: number; releaseDate: string | null; status: 'processing' | 'ready' | 'held'
}
export async function fetchAwaiting() {
  const body = await api.get<{ payouts: AwaitingPayout[]; currency?: Currency }>('/admin/payouts/awaiting')
  return { payouts: body.payouts, currency: body.currency }
}
export const releasePayout = (organizerId: string, eventId: string) => api.post(`/admin/payouts/${organizerId}/${eventId}/release`)
