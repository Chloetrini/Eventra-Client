// types/admin-refunds.ts

// Matches the real backend enum on RefundRequest (src/models/refundRequest.ts)
export type RefundRequestStatus = "pending" | "approved" | "rejected" | "processed"
// Matches the real backend enum on PaymentDispute (src/models/paymentDispute.ts)
export type DisputeStatus = "pending" | "resolved" | "lost"
// Set once an admin has responded on the Disputes tab — see
// merchantResponseStatus on the backend PaymentDispute model. `status`
// above only flips once Paystack's webhook confirms the real outcome, so
// a dispute can be "challenged" here while still showing "pending" above.
export type DisputeMerchantResponseStatus = "challenged" | "accepted-loss"

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
  description: string
  requestedResolution: string
  evidence: { url: string }[]
  additionalInformation: string
  amount: number
  status: RefundRequestStatus
  createdAt: string
  updatedAt: string
  // The admin's own viewer currency — `amount` (and ticket.price) above
  // are already converted into it server-side (see getRefundRequestDetail,
  // admin.controller.ts).
  currency?: string
}

// The admin Refunds table's list endpoint (listRefundRequests) populates a
// narrower field set than the detail endpoint (getRefundRequestDetail) —
// this mirrors exactly that, rather than casting the narrower response as
// the full RefundRequestPopulated shape above.
export interface RefundRequestSummary {
  _id: string
  ticket: {
    attendeeName: string
    attendeeEmail: string
  }
  event: {
    _id: string
    title: string
    slug: string
  }
  amount: number
  reason: string
  status: RefundRequestStatus
  createdAt: string
  // The admin's own viewer currency — `amount` above is already converted
  // into it server-side (see listRefundRequests, admin.controller.ts).
  currency?: string
}

// Mirrors what `PaymentDispute.find().populate('event').populate('order')...`
// actually returns from listDisputes (admin.controller.ts) — a real
// Paystack chargeback, not an attendee-submitted refund request.
export interface DisputeSummary {
  _id: string
  event: {
    _id: string
    title: string
    slug: string
  } | null
  order: {
    _id: string
    buyer?: { fullname: string; email: string } | null
    guestName?: string
    guestEmail?: string
  } | null
  amount: number
  reason?: string
  status: DisputeStatus
  merchantResponseStatus?: DisputeMerchantResponseStatus
  merchantResponseMessage?: string
  merchantRespondedAt?: string
  raisedAt: string
  resolvedAt?: string
  // The admin's own viewer currency — `amount` above is already converted
  // into it server-side (see listDisputes, admin.controller.ts).
  currency?: string
}
