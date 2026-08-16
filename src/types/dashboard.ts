export type OrganizerAccountStatus =
  | "unverified"    // hasn't finished onboarding (bank details, etc.)
  | "pending"        // onboarding done, under review by admin
  | "verified"       // approved and active
  | "rejected";      // application declined

export interface DashboardEvent {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  sold: string;
  status: 'Live' | 'Sold out' | 'Draft' | 'Pending' | 'Past' | 'Rejected' | 'Cancelled' | 'Postponed';
  imageUrl?: string;
}

export interface DashboardStats {
  ticketsSold: { value: string; change: number; subtext: string };
  revenue: { value: string; change: number; subtext: string };
  liveEvents: { value: string; subtext: string };
  payoutDue: { value: string; subtext: string };
}

export type RevenuePeriod = '7d' | '30d' | '1m';

/** One point on the revenue-over-time bar chart. `label` is an ISO date
 * (YYYY-MM-DD) for '7d'/'30d' periods, or 'W1'..'Wn' for the '1m' period. */
export interface RevenueSeriesPoint {
  label: string;
  amount: number;
}

/** One slice of the ticket-type breakdown chart. Paid ticket tiers only. */
export interface TicketsByTypeSlice {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardData {
  organization: { name: string; logo: string | null };
  accountStatus: OrganizerAccountStatus;
  stats: DashboardStats;
  recentEvents: DashboardEvent[];
  revenueSeries: RevenueSeriesPoint[];
  ticketsByType: TicketsByTypeSlice[];
}