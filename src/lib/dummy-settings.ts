import type { OrganizationSettings } from "@/types/settings";

export const settings: OrganizationSettings = {
  organizationName: "Lagos Live Co.",
  city: "Lagos",
  publicEmail: "hello@lagoslive.ng",
  phone: "+234 800 000 0000",
  bankAccount: null,
  notifications: {
    newTicketSales: false,
    dailySalesSummary: false,
    payoutConfirmations: false,
    eventApprovals: false,
  },
};