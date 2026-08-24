import { api } from "@/lib/api";
import type {
  OverviewSummary,
  PlatformRevenueData,
  RevenueRange,
  IconKey,
  ActivityTone,
} from "@/types/overview";
import type { Flag, AuditLogEntry } from "@/types/report";
import { formatCompactNaira, formatRequestedAgo } from "@/lib/utils";

// Raw shape of GET /admin/overview, as actually returned by
// getAdminOverview in admin.controller.ts — counts and unformatted
// numbers, not display-ready strings. Mapped into the frontend's
// display-ready OverviewSummary/PlatformRevenueData shapes below so none
// of the existing Overview components (StatsRow, TrustSafetyCard,
// RecentActivityCard, etc.) need to change.
interface RawAdminOverview {
  needsAction: {
    pendingEventsCount: number;
    organizersToVerifyCount: number;
    promotionsPendingCount: number;
    pendingRefundsCount: number;
    // Not tracked yet on the backend (no distinct "needs escalation" flag
    // on refund requests) — genuinely null, not a fabricated 0.
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
}

async function fetchRawAdminOverview(period: RevenueRange = "30d"): Promise<RawAdminOverview> {
  const res = await api.get(`/admin/overview?period=${period}`);
  return res.body as RawAdminOverview;
}

// type -> (icon, tone) for the Recent Activity card. Falls back to a
// neutral check/info pairing for any activity type the frontend doesn't
// recognize yet, rather than throwing — new backend activity types
// should degrade gracefully here, not break the whole card.
const ACTIVITY_ICON_TONE: Record<string, { icon: IconKey; tone: ActivityTone }> = {
  event_approved: { icon: "check", tone: "success" },
  event_rejected: { icon: "x", tone: "danger" },
  event_flagged: { icon: "x", tone: "danger" },
  event_unflagged: { icon: "check", tone: "info" },
  organizer_approved: { icon: "check", tone: "info" },
  organizer_rejected: { icon: "x", tone: "danger" },
  refund_approved: { icon: "undo", tone: "warning" },
  refund_rejected: { icon: "x", tone: "danger" },
  promotion_approved: { icon: "sparkles", tone: "warning" },
  promotion_rejected: { icon: "x", tone: "danger" },
  // Not live on the backend yet (see the Disputes feature's separate
  // delivery) — included here so Recent Activity renders correctly the
  // moment that lands, instead of needing a second pass on this file.
  dispute_challenged: { icon: "shield", tone: "warning" },
  dispute_accepted_loss: { icon: "undo", tone: "danger" },
};

export async function getOverviewSummary(): Promise<OverviewSummary> {
  const raw = await fetchRawAdminOverview();

  const needsAction: OverviewSummary["needsAction"] = [
    {
      id: "events-pending",
      count: raw.needsAction.pendingEventsCount,
      label: "Events pending review",
      ctaLabel: "Review",
      href: "/admin/events?status=pending",
      variant: "default" as const,
    },
    {
      id: "organizers-to-verify",
      count: raw.needsAction.organizersToVerifyCount,
      label: "Organizers to verify",
      ctaLabel: "Review",
      href: "/admin/organizers?status=pending",
      variant: "default" as const,
    },
    {
      id: "promotions-pending",
      count: raw.needsAction.promotionsPendingCount,
      label: "Promotions pending",
      ctaLabel: "Review",
      href: "/admin/promotions?status=pending",
      variant: "default" as const,
    },
    {
      id: "refunds-requests",
      count: raw.needsAction.pendingRefundsCount,
      label: "Refund requests",
      ctaLabel: "Review",
      href: "/admin/refunds-dispute",
      variant: "default" as const,
    },
    // refundsToInvestigateCount is null until the backend actually tracks
    // an "escalated" refund state — omit the card entirely rather than
    // show a fake 0/urgent badge for something that isn't real yet.
    ...(raw.needsAction.refundsToInvestigateCount !== null
      ? [
          {
            id: "refunds-flagged",
            count: raw.needsAction.refundsToInvestigateCount,
            label: "Refunds to investigate",
            ctaLabel: "Investigate",
            href: "/admin/refunds-dispute",
            variant: "urgent" as const,
          },
        ]
      : []),
  ].filter((item) => item.count > 0);

  const totalAttentionItems = needsAction.reduce((sum, item) => sum + item.count, 0);

  const stats: OverviewSummary["stats"] = [
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
      caption: "Commissions + promotions",
      ...(raw.stats.platformRevenueChangePct !== null
        ? {
            trend: {
              direction: raw.stats.platformRevenueChangePct >= 0 ? ("up" as const) : ("down" as const),
              value: `${Math.abs(raw.stats.platformRevenueChangePct)}%`,
              caption: "vs last month",
            },
          }
        : {}),
    },
    {
      id: "held-in-escrow",
      label: "Held in escrow",
      value: `₦${formatCompactNaira(raw.stats.heldInEscrow)}`,
      icon: "shield",
    },
    {
      id: "active-events",
      label: "Active events",
      value: String(raw.stats.activeEventsCount),
      icon: "calendar",
      caption: `${raw.stats.activeOrganizersCount} Organizers`,
    },
  ];

  const trustSafety: OverviewSummary["trustSafety"] = [
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
  ];

  const recentActivity: OverviewSummary["recentActivity"] = raw.recentActivity.map((entry) => {
    const { icon, tone } = ACTIVITY_ICON_TONE[entry.type] ?? { icon: "check", tone: "info" };
    return {
      id: entry.id,
      icon,
      tone,
      // The backend already builds a full, human-readable message at
      // write time (see AdminActivityLog's doc comment) — no per-entity
      // bold segments to reconstruct here, just render it as one segment.
      segments: [{ text: entry.message }],
      timestamp: `${entry.actorName} · ${formatRequestedAgo(entry.createdAt)}`,
    };
  });

  const topOrganizers: OverviewSummary["topOrganizers"] = raw.topOrganizers.map((org) => ({
    id: org.organizerId,
    name: org.businessName,
    revenue: `₦${formatCompactNaira(org.grossSales)}`,
  }));

  return { totalAttentionItems, needsAction, stats, trustSafety, recentActivity, topOrganizers };
}


export async function getFlags():  Promise<Flag[]> {
  // const { data} = await apiClient.get("/admin/reports/flags")
  // return data

  throw new Error("getFlags: backend not wired up yet, currently using mock data in the hook")
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  // const { data } = await apiClient.get("/admin/reports/audit-log");
  // return data;

  throw new Error ("getAuditLog: backend not wired up yet, currently using mock data in the hook")
}
export async function getPlatformRevenue(range: RevenueRange): Promise<PlatformRevenueData> {
  const raw = await fetchRawAdminOverview(range);

  return {
    range,
    value: `₦${formatCompactNaira(raw.stats.platformRevenue)}`,
    deltaPercent: raw.stats.platformRevenueChangePct ?? 0,
    deltaCaption: "vs last month",
    series: raw.revenueSeries,
  };
}
