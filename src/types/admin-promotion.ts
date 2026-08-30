export type AdminPromotionStatus = "pending" | "approved" | "rejected"

// One row on the Approvals page's Promotions tab — mirrors
// listPendingPromotions (admin.controller.ts).
export interface AdminPromotionListItem {
  eventId: string
  eventTitle: string
  eventCoverImage?: string
  organizerId?: string
  organizerName: string
  packageId: string
  packageLabel: string
  placementLabel?: string
  price: number | null
  durationDays?: number
  paidAt?: string
  paystackReference?: string
}

// The Promotions tab's detail view — mirrors
// getEventPromotionDetailForAdmin (admin.controller.ts).
export interface AdminPromotionDetail {
  eventId: string
  eventTitle: string
  eventSlug?: string
  eventCoverImage?: string
  eventCategory?: string
  eventStartDate?: string
  organizer: {
    id?: string
    name: string
    email?: string
    verified: boolean
  }
  packageId: string
  packageLabel: string
  packageDescription?: string
  placementLabel?: string
  price: number | null
  durationDays?: number
  status: AdminPromotionStatus
  startsAt?: string
  endsAt?: string
  paidAt?: string
  paystackReference?: string
  currency: string
}
