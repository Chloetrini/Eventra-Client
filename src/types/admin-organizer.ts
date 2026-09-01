export type AdminOrganizerStatus = "VERIFIED" | "PENDING" | "SUSPENDED" | "REJECTED";

export interface AdminOrganizerEventSummary {
  id: string;
  title: string;
  slug: string;
  status: string;
  ticketsSold: number;
  revenue: number;
}

export interface AdminOrganizerDetailsData {
  email: string;
  phone: string;
  bio?: string;
  address?: string;
  joinedDate: string;
  cacCertificateUrl?: string;
  directorIdUrl?: string;
  proofOfAddressUrl?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankCode?: string;
    bankName?: string
    isPayoutReady: boolean;
  };
  recentEvents: AdminOrganizerEventSummary[];
}

export interface AdminOrganizer {
  _id: string;
  name: string;
  email: string;
  createdAt: string
  category?:string;
  initials: string;
  avatarUrl?: string;
  status: AdminOrganizerStatus;
  eventCount: number;
  formattedRevenue: string;
  rawRevenue: number;
  // The admin's own viewer currency — rawRevenue/formattedRevenue above
  // are already converted into it server-side (see listOrganizersForAdmin
  // / getOrganizerDetailForAdmin, admin.controller.ts).
  currency?: string;
  details?: AdminOrganizerDetailsData;
}
