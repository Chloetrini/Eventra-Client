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
  status: 'Live' | 'Sold out' | 'Draft' | 'Past';
  imageUrl?: string;
}

export interface DashboardStats {
  ticketsSold: { value: string; change: number; subtext: string };
  revenue: { value: string; change: number; subtext: string };
  liveEvents: { value: string; subtext: string };
  payoutDue: { value: string; subtext: string };
}

export interface DashboardData {
  organization: { name: string; logo: string | null };
  accountStatus: OrganizerAccountStatus;
  stats: DashboardStats;
  recentEvents: DashboardEvent[];
}