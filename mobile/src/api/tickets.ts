import { api } from './client'
import type { EventSummary, MyTicket } from './types'

export async function fetchMyTickets(): Promise<MyTicket[]> {
  const body = await api.get<MyTicket[] | { tickets: MyTicket[] }>('/tickets/my-tickets')
  return Array.isArray(body) ? body : body.tickets ?? []
}

export const fetchQr = (ticketId: string) =>
  api.get<{ qrCodeDataUrl: string }>(`/tickets/${ticketId}/qrcode`)

export const rsvpFreeEvent = (eventId: string, guests = 1) =>
  api.post(`/tickets/rsvp/${eventId}`, { guests })

export const initializeCheckout = (eventId: string, items: { ticketTypeId: string; quantity: number }[]) =>
  api.post<{ orderId: string; reference: string; authorizationUrl: string; total: number }>(
    `/tickets/checkout/${eventId}`,
    { items },
  )

export const getOrderByReference = (reference: string) =>
  api.get<{ status: 'pending' | 'paid' | 'failed' | string; tickets?: MyTicket[] }>(`/tickets/orders/${reference}`)

export const fetchSavedEvents = () => api.get<EventSummary[]>('/users/saved-events')
export const saveEvent = (id: string) => api.post(`/users/saved-events/${id}`)
export const unsaveEvent = (id: string) => api.delete(`/users/saved-events/${id}`)
