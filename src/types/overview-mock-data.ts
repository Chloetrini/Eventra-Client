import type {
  OverviewSummary,
  PlatformRevenueData,
  RevenueRange,
} from "@/types/overview";

// Mirrors the Figma "admin overview" artboards. Swap out once
// GET /admin/overview/summary and GET /admin/overview/platform-revenue
// are live — see lib/api/admin.ts.

export const mockOverviewSummary: OverviewSummary = {
  totalAttentionItems: 15, // 5 + 3 + 2 + 3 + 2
  needsAction: [
    {
      id: "events-pending",
      count: 5,
      label: "Events pending review",
      ctaLabel: "Review",
      href: "/admin/events?status=pending",
      variant: "default",
    },
    {
      id: "organizers-to-verify",
      count: 3,
      label: "Organizers to verify",
      ctaLabel: "Review",
      href: "/admin/organizers?status=pending",
      variant: "default",
    },
    {
      id: "promotions-pending",
      count: 2,
      label: "Promotions pending",
      ctaLabel: "Review",
      href: "/admin/promotions?status=pending",
      variant: "default",
    },
    {
      id: "refunds-requests",
      count: 3,
      label: "Refunds requests",
      ctaLabel: "Review",
      href: "/admin/refunds",
      variant: "default",
    },
    {
      id: "refunds-flagged",
      count: 2,
      label: "Refunds requests",
      ctaLabel: "Investigate",
      href: "/admin/refunds?flagged=true",
      variant: "urgent",
    },
  ],
  stats: [
    {
      id: "gross-ticket-sales",
      label: "Gross ticket sales",
      value: "₦84.2M",
      icon: "ticket",
      trend: { direction: "up", value: "12%", caption: "vs last month" },
    },
    {
      id: "platform-revenue",
      label: "Platform revenue",
      value: "₦4.9M",
      icon: "dollar",
      caption: "Commissions + promotions",
    },
    {
      id: "held-in-escrow",
      label: "Held in escrow",
      value: "₦31.6m",
      icon: "shield",
      caption: "Across 22 countries",
    },
    {
      id: "active-events",
      label: "Active events",
      value: "148",
      icon: "calendar",
      caption: "62 Organizers",
    },
  ],
  trustSafety: [
    { id: "flagged-events", label: "Flagged events", value: "2", tone: "danger" },
    { id: "open-disputes", label: "Open payments Dispute", value: "1" },
    { id: "refund-rate", label: "Refund rate (30d)", value: "3.2%" },
    { id: "new-organizers", label: "New Organizers today", value: "4" },
  ],
  recentActivity: [
    {
      id: "act-1",
      icon: "check",
      tone: "success",
      segments: [
        { text: "Approved event " },
        { text: "Afrobeats Night Market", bold: true },
        { text: " by " },
        { text: "Lagos Live Co.", bold: true },
      ],
      timestamp: "You · 8m ago",
    },
    {
      id: "act-2",
      icon: "check",
      tone: "info",
      segments: [{ text: "Verified organizer " }, { text: "Party verse", bold: true }],
      timestamp: "You · 41m ago",
    },
    {
      id: "act-3",
      icon: "undo",
      tone: "warning",
      segments: [
        { text: "Issued refund of " },
        { text: "₦15000", bold: true },
        { text: " to " },
        { text: "Ada Okafor", bold: true },
      ],
      timestamp: "You · 1h ago",
    },
    {
      id: "act-4",
      icon: "x",
      tone: "danger",
      segments: [
        { text: "Rejected event " },
        { text: "Crypto Riches Seminar", bold: true },
        { text: ", reason: misleading" },
      ],
      timestamp: "You · 2h ago",
    },
    {
      id: "act-5",
      icon: "sparkles",
      tone: "warning",
      segments: [
        { text: "Approved promotion " },
        { text: "Detty December beat party", bold: true },
      ],
      timestamp: "You · 3h ago",
    },
  ],
  topOrganizers: [
    { id: "org-1", name: "Lagos Live Co.", revenue: "₦18.4M" },
    { id: "org-2", name: "PartyVerse NG", revenue: "₦12.1M" },
    { id: "org-3", name: "Tix Africa Events", revenue: "₦9.6M" },
    { id: "org-4", name: "Naija Comedy Co.", revenue: "₦7.2M" },
  ],
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function buildSeries(labels: string[], base: number, spread: number) {
  return labels.map((label, i) => ({
    label,
    // gentle upward wobble so the mock line isn't a flat/robotic curve
    amount: Math.round(base + Math.sin(i / 1.6) * spread + i * (spread / labels.length)),
  }));
}

export const mockPlatformRevenueByRange: Record<RevenueRange, PlatformRevenueData> = {
  "7d": {
    range: "7d",
    value: "₦2.26M",
    deltaPercent: 12,
    deltaCaption: "vs last month",
    series: buildSeries(WEEKDAY_LABELS, 280_000, 60_000),
  },
  "30d": {
    range: "30d",
    value: "₦4.9M",
    deltaPercent: 4,
    deltaCaption: "vs last month",
    series: buildSeries(WEEKDAY_LABELS, 600_000, 120_000),
  },
  "12m": {
    range: "12m",
    value: "₦52.1M",
    deltaPercent: 19,
    deltaCaption: "vs last month",
    series: buildSeries(MONTH_LABELS, 3_500_000, 900_000),
  },
};