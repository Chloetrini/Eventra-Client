// One purchasable tier, in DISPLAY shape (already transformed from the
// backend's raw TicketType — see the mapping in routes/main/event-id/index.tsx).
export type TicketTier = {
  id: string;
  type: string;
  description?: string;
  unitPrice: number;
  quantityLeft: number;
  availability: "sold out" | "scarce" | "available";
  // Max tickets of this tier one person can buy in a single order —
  // backend's TicketType.purchaseLimitPerPerson (already enforced
  // server-side in ticket.controller.ts). Optional here only because a
  // couple of other TicketTier producers in the codebase don't set it;
  // when absent, PaidEventTicket just doesn't cap the quantity picker.
  purchaseLimitPerPerson?: number;
};

// The ticket-tier group for ONE event (the "menu" of what you can buy).
export type EventTickets = {
  eventSlug: string;
  serviceFeePercent: number;
  tiers: TicketTier[];
};
