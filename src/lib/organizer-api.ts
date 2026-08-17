import { api } from "@/lib/api";
import { formatCompactNaira } from "@/lib/utils";
import type {
  DashboardData,
  DashboardEvent,
  OrganizerAccountStatus,
  RevenueSeriesPoint,
  TicketsByTypeSlice,
  RevenuePeriod,
} from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

// ---------------------------------------------------------------------
// Real backend response shapes
// ---------------------------------------------------------------------
type RealOverviewResponse = {
  ticketsSold: number;
  ticketsSoldChangePct: number | null;
  revenue: number;
  revenueChangePct: number | null;
  liveEventsCount: number;
  payoutDue: number;
  nextPayoutInDays: number | null;
  recentEvents: Array<{
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    category?: string;
    startDate: string;
    soldCount: number;
    capacity: number | null;
    status: string;
    statusLabel: string;
  }>;
  revenueSeries: RevenueSeriesPoint[];
  ticketsByType: TicketsByTypeSlice[];
};

type RealOrganizerProfile = {
  businessName?: string;
  category?: string;
  city?: string;
  contactPhone?: string;
  publicEmail?: string;
  bio?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  isPayoutReady?: boolean;
  approvalStatus?: "draft" | "pending" | "approved" | "rejected";
  paystackRecipientCode?: string;
} | null;

// ---------------------------------------------------------------------
// Adapters — reshape real backend data into what the Dashboard UI expects
// ---------------------------------------------------------------------
// The backend's /dashboard endpoint already resolves each event down to
// its display status via deriveEventDisplayStatus (draft, pending_approval,
// rejected, cancelled, postponed, sold_out, live, past) — this just maps
// those exact values onto the capitalized labels the UI renders.
function mapEventStatus(status: string): DashboardEvent["status"] {
  const s = status.toLowerCase();
  if (s === "live") return "Live";
  if (s === "sold_out" || s === "sold out") return "Sold out";
  if (s === "draft") return "Draft";
  if (s === "pending_approval" || s === "pending") return "Pending";
  if (s === "rejected") return "Rejected";
  if (s === "cancelled") return "Cancelled";
  if (s === "postponed") return "Postponed";
  return "Past";
}

function mapApprovalStatus(status?: string): OrganizerAccountStatus {
  if (status === "approved") return "verified";
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "unverified"; // covers "draft" and missing/undefined
}

function adaptOverview(raw: RealOverviewResponse) {
  const changeSubtext = (pct: number | null) =>
    pct === null ? "No prior data" : "vs last month";

  return {
    stats: {
      ticketsSold: {
        value: raw.ticketsSold.toLocaleString(),
        change: raw.ticketsSoldChangePct ?? 0,
        subtext: changeSubtext(raw.ticketsSoldChangePct),
      },
      revenue: {
        value: formatCompactNaira(raw.revenue),
        change: raw.revenueChangePct ?? 0,
        subtext: changeSubtext(raw.revenueChangePct),
      },
      liveEvents: {
        value: raw.liveEventsCount.toLocaleString(),
        subtext: raw.liveEventsCount > 0 ? `${raw.liveEventsCount} selling now` : "None right now",
      },
      payoutDue: {
        value: formatCompactNaira(raw.payoutDue),
        subtext: raw.nextPayoutInDays !== null
          ? `Next payout in ${raw.nextPayoutInDays} days`
          : "No payout scheduled",
      },
    },
    recentEvents: raw.recentEvents.map((e): DashboardEvent => ({
      id: e._id,
      title: e.title,
      subtitle: e.category ?? "",
      date: new Date(e.startDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      sold: e.capacity !== null ? `${e.soldCount} / ${e.capacity}` : `${e.soldCount}`,
      status: mapEventStatus(e.status),
      imageUrl: e.coverImage,
    })),
    revenueSeries: raw.revenueSeries,
    ticketsByType: raw.ticketsByType,
  };
}

// ---------------------------------------------------------------------
// Real fetch — combines /organizer/overview + /organizer/profile
// ---------------------------------------------------------------------
export async function fetchDashboardReal(period: RevenuePeriod = "30d"): Promise<DashboardData> {
  const [overviewRes, profileRes] = await Promise.all([
    api.get(`/organizers/overview?period=${period}`),
    api.get("/organizers/profile"),
  ]);

  const overview = overviewRes.body as RealOverviewResponse;
  const profile = profileRes.body as RealOrganizerProfile;

  const adapted = adaptOverview(overview);

  return {
    organization: {
      name: profile?.businessName ?? "Your Organization",
      logo: null, // backend doesn't have an organization logo field yet
    },
    accountStatus: mapApprovalStatus(profile?.approvalStatus),
    ...adapted,
  };
}

// ---------------------------------------------------------------------
// ONE-LINE SWITCH: flip this when you want mock data instead of live
// ---------------------------------------------------------------------
export function fetchDashboard(period: RevenuePeriod = "30d"): Promise<DashboardData> {
  return fetchDashboardReal(period);
  // return fetchDashboardMock(); // if you kept the old mock import around
}

export function useOrganizerStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ["organizer-status"],
    queryFn: async () => {
      const res = await api.get("/organizers/profile");
      const profile = res.body as { approvalStatus?: "draft" | "pending" | "approved" | "rejected" } | null;
      if (profile?.approvalStatus === "approved") return "verified" as const;
      if (profile?.approvalStatus === "pending") return "pending" as const;
      if (profile?.approvalStatus === "rejected") return "rejected" as const;
      return "unverified" as const;
    },
  });
  return { status: data ?? "unverified", isLoading };
}

// Slightly richer than useOrganizerStatus — also exposes isPayoutReady
// (bank details on file), which is tracked independently of approval:
// a free-events-only organizer can be fully "verified" and still never
// have added a bank account. The Payouts page needs both signals.
export function useOrganizerProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["organizer-profile"],
    queryFn: async () => {
      const res = await api.get("/organizers/profile");
      return res.body as RealOrganizerProfile;
    },
  });
  return {
    status: mapApprovalStatus(data?.approvalStatus),
    isPayoutReady: data?.isPayoutReady ?? false,
    isLoading,
  };
}