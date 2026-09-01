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
  // Raw ISO start date, kept alongside the formatted `date` display string
  // above — needed to work out whether a live event is still inside the
  // edit cutoff window (see isLiveEditableEvent / EventActionsMenu).
  startDate: string;
  sold: string;
  status: 'Live' | 'Sold out' | 'Draft' | 'Pending' | 'Past' | 'Rejected' | 'Cancelled' | 'Postponed';
  imageUrl?: string;
}

export interface DashboardStats {
  // null = no prior-period data to compare against (e.g. a brand new
  // account's first month) — distinct from an actual 0% change.
  ticketsSold: { value: string; change: number | null; subtext: string };
  revenue: { value: string; change: number | null; subtext: string };
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
  // The organizer's own viewer currency — revenueSeries amounts are
  // already converted into it server-side (see fetchDashboardReal,
  // organizer-api.ts).
  currency?: string;
}
