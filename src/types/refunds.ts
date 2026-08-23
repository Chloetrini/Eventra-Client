// types/admin-refunds.ts

// Matches the backend's actual RefundRequest.status enum
// (models/refundRequest.ts) — 'declined' was never a real value, and
// 'processed' (an approved request that's actually had money moved by
// Paystack) was missing entirely.
export type RefundRequestStatus = "pending" | "approved" | "rejected" | "processed"
export type DisputeStatus = "open" | "won" | "lost"

// Mirrors what GET /admin/refund-requests/:id actually returns
// (getRefundRequestDetail in admin.controller.ts) field-for-field.
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
  // From the attendee-facing form (RefundsValues) — real backend fields as
  // of the refund-form backend work, not flattened/derived here.
  description: string
  requestedResolution: string
  evidence: { url: string }[]
  additionalInformation: string
  amount: number
  status: RefundRequestStatus
  createdAt: string
  updatedAt: string
}

// The lighter shape GET /admin/refund-requests (listRefundRequests) returns
// — its `.populate('ticket', 'attendeeName attendeeEmail')` and
// `.populate('event', 'title slug')` calls select fewer fields than the
// detail endpoint's, so this is a distinct type rather than a subset cast
// of RefundRequestPopulated. Only what the requests table actually renders.
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
