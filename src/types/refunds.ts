// types/admin-refunds.ts

export type RefundRequestStatus = "pending" | "approved" | "declined"
export type DisputeStatus = "open" | "won" | "lost"

// Mirrors what `RefundRequest.find().populate('ticket').populate('event')...`
// would actually return — not flattened display fields, so this can swap to
// real API data later with no shape changes.
export interface RefundRequestPopulated {
  _id: string
  ticket: {
    _id: string
    ticketId: string // "TKT-VIP-8F9A12"
    code: string
    attendeeName: string
    attendeeEmail: string
    price: number
    ticketType: {
      _id: string
      name: string // "VIP", "early bird"
    }
  }
  order: string // order _id
  event: {
    _id: string
    title: string
    slug: string
    startDate: string
    refundPolicy: {
      type: "no-refunds" | "refund-until-days-before"
      daysBefore?: number
    }
  }
  requestedBy: string // user _id
  reason: string
  // From the attendee-facing form (RefundsValues) — not on the backend
  // model yet, but this is the shape once it's extended
  description: string
  requestedResolution: string
  evidence: { url: string }[]
  additionalInformation: string
  amount: number
  status: RefundRequestStatus
  createdAt: string
  updatedAt: string
}

export interface DisputeSummary {
  id: string
  attendeeName: string
  attendeeInitials: string
  eventName: string
  amount: number
  processor: "Paystack"
  status: DisputeStatus
}