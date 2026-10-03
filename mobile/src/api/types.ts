export type Currency = 'Naira' | 'Dollar' | 'Cedis' | 'Pound'

export type User = {
  _id: string
  fullname: string
  email: string
  role: 'attendee' | 'organizer' | 'admin'
  avatarUrl?: string
  isVerified?: boolean
}

export type TicketType = {
  _id: string
  name: string
  price: number
  quantity: number
  quantitySold: number
}

export type EventSummary = {
  _id: string
  slug: string
  title: string
  type: 'free' | 'paid'
  coverImage?: string
  startDate: string
  endDate?: string
  minPrice: number
  currency?: Currency
  venue?: { name: string; address?: string; city: string; state?: string }
  isOnline?: boolean
  category?: { _id: string; name?: string } | string | null
}

export type EventDetail = EventSummary & {
  description?: string
  ticketTypes: TicketType[]
  organizer?: { fullname?: string; organizerProfile?: { businessName?: string } }
  lineup?: { _id: string; name: string; role?: string }[]
}

export type Category = { _id: string; name: string; slug: string }

export type MyTicket = {
  _id: string
  ticketId: string
  code: string
  type: 'free' | 'paid'
  price: number
  status: 'valid' | 'checked_in' | 'cancelled' | 'refunded'
  attendeeName: string
  event: Pick<EventSummary, 'slug' | 'startDate' | 'venue' | 'coverImage'> & { title: string }
  ticketType?: { name: string }
}
