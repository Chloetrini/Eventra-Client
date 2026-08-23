import { api } from "@/lib/api";
import { formatCompactNaira } from "@/lib/utils";
import type {
  ActivityEntry,
  ActivityTone,
  IconKey,
  NeedsActionItem,
  OverviewSummary,
  PlatformRevenueData,
  RevenueRange,
  TopOrganizer,
} from "@/types/overview";

// Both the Overview page and the revenue chart are backed by the SAME
// backend endpoint, GET /admin/overview?period=7d|30d|12m — there's no
// separate /platform-revenue route. getOverviewSummary always asks for
// '30d' (the needs-action counts/stats/trust-safety numbers aren't
// period-scoped), while getPlatformRevenue asks for whatever range the
// chart's toggle is on and only uses the revenueSeries part of the
// response.
type AdminOverviewRaw = {
  needsAction: {
    pendingEventsCount: number;
    organizersToVerifyCount: number;
    promotionsPendingCount: number;
    pendingRefundsCount: number;
    // No backing data model for "needs escalation" vs. a routine refund
    // request yet — always null until that distinction exists.
    refundsToInvestigateCount: number | null;
  };
  stats: {
    grossTicketSales: number;
    platformRevenue: number;
    platformRevenueChangePct: number | null;
    heldInEscrow: number;
    activeEventsCount: number;
    activeOrganizersCount: number;
  };
  revenueSeries: { label: string; amount: number }[];
  trustAndSafety: {
    flaggedEventsCount: number;
    openPaymentDisputesCount: number;
    refundRate30d: number;
    newOrganizersToday: number;
  };
  topOrganizers: { organizerId: string; businessName: string; grossSales: number }[];
  recentActivity: {
    id: string;
    type: string;
    message: string;
    actorName: string;
    createdAt: string;
  }[];
};

async function fetchAdminOverview(period: RevenueRange): Promise<AdminOverviewRaw> {
  const res = await api.get(`/admin/overview?period=${period}`);
  return res.body as AdminOverviewRaw;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

// Every admin-activity type the backend can log (see AdminActivityType in
// the backend's models/adminActivityLog.ts) mapped to how it displays here.
const ACTIVITY_META: Record<string, { icon: IconKey; tone: ActivityTone }> = {
  event_approved: { icon: "check", tone: "success" },
  event_rejected: { icon: "x", tone: "danger" },
  event_flagged: { icon: "shield", tone: "warning" },
  event_unflagged: { icon: "check", tone: "info" },
  organizer_approved: { icon: "check", tone: "info" },
  organizer_rejected: { icon: "x", tone: "danger" },
  refund_approved: { icon: "undo", tone: "warning" },
  refund_rejected: { icon: "x", tone: "danger" },
  promotion_approved: { icon: "sparkles", tone: "warning" },
  promotion_rejected: { icon: "x", tone: "danger" },
};

function mapActivity(entry: AdminOverviewRaw["recentActivity"][number]): ActivityEntry {
  const meta = ACTIVITY_META[entry.type] ?? { icon: "check", tone: "info" as ActivityTone };
  return {
    id: entry.id,
    icon: meta.icon,
    tone: meta.tone,
    // The backend logs one pre-written message string per action, not
    // separate bold/plain segments — there's nothing here to safely split
    // into "bold the entity name" without guessing at the message's own
    // formatting, so the whole thing is one plain segment.
    segments: [{ text: entry.message }],
    timestamp: `${entry.actorName} · ${relativeTime(entry.createdAt)}`,
  };
}

function mapNeedsAction(raw: AdminOverviewRaw["needsAction"]): NeedsActionItem[] {
  // "Refunds requests (flagged/urgent)" from the original design is left
  // out here on purpose — there's no field on RefundRequest yet that
  // distinguishes a routine request from one that needs escalation
  // (refundsToInvestigateCount is always null), so showing a 5th card here
  // would mean inventing that number. The other four are all real counts.
  return [
    {
      id: "events-pending",
      count: raw.pendingEventsCount,
      label: "Events pending review",
      ctaLabel: "Review",
      href: "/admin/events?status=pending",
      variant: "default",
    },
    {
      id: "organizers-to-verify",
      count: raw.organizersToVerifyCount,
      label: "Organizers to verify",
      ctaLabel: "Review",
      href: "/admin/organizers?status=pending",
      variant: "default",
    },
    {
      id: "promotions-pending",
      count: raw.promotionsPendingCount,
      label: "Promotions pending",
      ctaLabel: "Review",
      href: "/admin/promotions?status=pending",
      variant: "default",
    },
    {
      id: "refunds-requests",
      count: raw.pendingRefundsCount,
      label: "Refunds requests",
      ctaLabel: "Review",
      href: "/admin/refunds",
      variant: "default",
    },
  ];
}

function mapTopOrganizers(raw: AdminOverviewRaw["topOrganizers"]): TopOrganizer[] {
  return raw.map((organizer) => ({
    id: organizer.organizerId,
    name: organizer.businessName,
    revenue: `₦${formatCompactNaira(organizer.grossSales)}`,
  }));
}

export async function getOverviewSummary(): Promise<OverviewSummary> {
  // The needs-action counts, stats, and trust & safety numbers aren't
  // period-scoped, so this always reads the 30d call — 30d is also the
  // chart's own default range.
  const raw = await fetchAdminOverview("30d");
  const needsAction = mapNeedsAction(raw.needsAction);

  return {
    totalAttentionItems: needsAction.reduce((sum, item) => sum + item.count, 0),
    needsAction,
    stats: [
      {
        id: "gross-ticket-sales",
        label: "Gross ticket sales",
        value: `₦${formatCompactNaira(raw.stats.grossTicketSales)}`,
        icon: "ticket",
      },
      {
        id: "platform-revenue",
        label: "Platform revenue",
        value: `₦${formatCompactNaira(raw.stats.platformRevenue)}`,
        icon: "dollar",
        ...(raw.stats.platformRevenueChangePct === null
          ? { caption: "Commissions + promotions" }
          : {
              trend: {
                direction: raw.stats.platformRevenueChangePct >= 0 ? ("up" as const) : ("down" as const),
                value: `${Math.abs(raw.stats.platformRevenueChangePct)}%`,
                caption: "vs last month",
              },
            }),
      },
      {
        id: "held-in-escrow",
        label: "Held in escrow",
        value: `₦${formatCompactNaira(raw.stats.heldInEscrow)}`,
        icon: "shield",
        caption: "Awaiting organizer payout",
      },
      {
        id: "active-events",
        label: "Active events",
        value: String(raw.stats.activeEventsCount),
        icon: "calendar",
        caption: `${raw.stats.activeOrganizersCount} organizer${raw.stats.activeOrganizersCount === 1 ? "" : "s"}`,
      },
    ],
    trustSafety: [
      {
        id: "flagged-events",
        label: "Flagged events",
        value: String(raw.trustAndSafety.flaggedEventsCount),
        tone: raw.trustAndSafety.flaggedEventsCount > 0 ? "danger" : "default",
      },
      {
        id: "open-disputes",
        label: "Open payment disputes",
        value: String(raw.trustAndSafety.openPaymentDisputesCount),
        tone: raw.trustAndSafety.openPaymentDisputesCount > 0 ? "danger" : "default",
      },
      {
        id: "refund-rate",
        label: "Refund rate (30d)",
        value: `${raw.trustAndSafety.refundRate30d}%`,
      },
      {
        id: "new-organizers",
        label: "New organizers today",
        value: String(raw.trustAndSafety.newOrganizersToday),
      },
    ],
    recentActivity: raw.recentActivity.map(mapActivity),
    topOrganizers: mapTopOrganizers(raw.topOrganizers),
  };
}

export async function getPlatformRevenue(range: RevenueRange): Promise<PlatformRevenueData> {
  const raw = await fetchAdminOverview(range);
  const total = raw.revenueSeries.reduce((sum, point) => sum + point.amount, 0);

  return {
    range,
    value: `₦${formatCompactNaira(total)}`,
    // The backend only computes one delta (commission revenue, last 30
    // days vs. the 30 before that) — reused here regardless of the
    // selected range since there's no per-range baseline to compare
    // against for 7d/12m.
    deltaPercent: raw.stats.platformRevenueChangePct ?? 0,
    deltaCaption: raw.stats.platformRevenueChangePct === null ? "No prior period to compare" : "vs last month",
    series: raw.revenueSeries.map((point) => ({
      // 7d/30d buckets come back as raw ISO date keys (e.g. "2026-08-01")
      // from the backend; 12m buckets already come back as short month
      // names ("Jan".."Dec") and pass through unchanged.
      label:
        range === "12m"
          ? point.label
          : new Date(point.label).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
      amount: point.amount,
    })),
  };
}
