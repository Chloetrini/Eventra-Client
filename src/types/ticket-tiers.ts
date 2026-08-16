// One purchasable tier, in DISPLAY shape (already transformed from the
// backend's raw TicketType — see the mapping in event.id/index.tsx).
export type TicketTier = {
  id: string;
  type: string;
  description?: string;
  unitPrice: number;
  quantityLeft: number;
  availability: "sold out" | "scarce" | "available";
};

// The ticket-tier group for ONE event (the "menu" of what you can buy).
export type EventTickets = {
  eventSlug: string;
  serviceFeePercent: number;
  tiers: TicketTier[];
};