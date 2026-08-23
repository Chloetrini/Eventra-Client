// mock-data/refunds.ts
import type { RefundRequestPopulated, DisputeSummary } from "@/types/refunds"

// Reused across both mock requests — same real event from your DB
const testingEvent = {
  _id: "6a884392ba3c13a7260ef6a8",
  title: "testing paid event with refund policy",
  slug: "testing-paid-event-with-refund-policy-c9a7a7",
  startDate: "2026-09-17T23:20:00.000Z",
  refundPolicy: {
    type: "no-refunds" as const,
    daysBefore: 7,
  },
}

export const mockRefundRequests: RefundRequestPopulated[] = [
  {
    _id: "rr_6a88be9b0001",
    ticket: {
      _id: "6a88be9bdaca9c0069873305",
      ticketId: "TKT-VIP-8F9A12",
      code: "EVT-VIP-99A1C3E2",
      attendeeName: "Dave Tolu",
      attendeeEmail: "ogungbemitolulope2004@gmail.com",
      price: 300000,
      ticketType: {
        _id: "6a8845bac42ac07f48644e37",
        name: "VIP",
      },
    },
    order: "6a884d25e2d0ec9c1ec2b8f9",
    event: testingEvent,
    requestedBy: "6a80bb7beca1b2a528da870d",
    reason: "Can no longer attend",
    description:
      "Something came up with work travel and I won't be in Lagos that weekend anymore. Would appreciate a refund since it's still well within the window.",
    requestedResolution: "Full refund",
    evidence: [
      { url: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1787445162/eventra/lineup-photos/shugnqlcghni73hdujue.jpg" },
    ],
    additionalInformation: "",
    amount: 300000,
    status: "pending",
    createdAt: "2026-08-22T13:00:00.000Z",
    updatedAt: "2026-08-22T13:00:00.000Z",
  },
  {
    _id: "rr_6a88bf430001",
    ticket: {
      _id: "6a88bf43daca9c0069873306",
      ticketId: "TKT-EB-34B7D8",
      code: "EVT-EB-44F2B8D1",
      attendeeName: "Dave Tolu",
      attendeeEmail: "ogungbemitolulope2004@gmail.com",
      price: 30000,
      ticketType: {
        _id: "6a8845ba26d8ef60050187e2",
        name: "early bird",
      },
    },
    order: "6a884d25e2d0ec9c1ec2b8f9",
    event: testingEvent,
    requestedBy: "6a80bb7beca1b2a528da870d",
    reason: "Bought duplicate tickets",
    description:
      "I accidentally checked out twice for the same show — same email, two separate orders about a minute apart.",
    requestedResolution: "Partial refund",
    evidence: [
      { url: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1787445162/eventra/lineup-photos/shugnqlcghni73hdujue.jpg" },
      { url: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1/sample-evidence-3.png" },
    ],
    additionalInformation: "Order references are one digit apart if that helps confirm it.",
    amount: 30000,
    status: "pending",
    createdAt: "2026-08-21T10:00:00.000Z",
    updatedAt: "2026-08-21T10:00:00.000Z",
  },
]

export const mockDisputes: DisputeSummary[] = [
  {
    id: "d_1",
    attendeeName: "Tunde Bello",
    attendeeInitials: "TB",
    eventName: "Afrobeats Night Market",
    amount: 35000,
    processor: "Paystack",
    status: "open",
  },
]