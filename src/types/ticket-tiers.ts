import type { z } from "zod";
import type { ticketTierSchema } from "@/lib/schema";

// One purchasable tier (Early Bird / Regular / VIP). Inferred from the schema.
export type TicketTier = z.infer<typeof ticketTierSchema>;

// The ticket-tier group for ONE event (the "menu" of what you can buy).
// Backend serves this from its own collection: GET /events/:slug/tickets
export type EventTickets = {
  eventSlug: string;
  serviceFeePercent: number;
  tiers: TicketTier[];
};