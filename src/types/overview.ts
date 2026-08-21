// Shared types for the admin Overview page.
// Kept API-shape-agnostic on purpose — icons are referenced by key (not
// component), so this stays serializable and matches what the backend
// will eventually return as JSON.

export type IconKey =
  | "ticket"
  | "dollar"
  | "shield"
  | "calendar"
  | "check"
  | "undo"
  | "x"
  | "sparkles";

export type NeedsActionVariant = "default" | "urgent";

export interface NeedsActionItem {
  id: string;
  count: number;
  label: string;
  ctaLabel: string; // "Review" | "Investigate"
  href: string;
  variant: NeedsActionVariant;
}

export interface StatTrend {
  direction: "up" | "down";
  value: string; // e.g. "12%"
  caption: string; // e.g. "vs last month"
}

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: IconKey;
  trend?: StatTrend;
  caption?: string; // used when there's no trend, e.g. "Across 22 countries"
}

export interface TrustSafetyItem {
  id: string;
  label: string;
  value: string;
  tone?: "default" | "danger";
}

export interface ActivitySegment {
  text: string;
  bold?: boolean;
}

export type ActivityTone = "success" | "info" | "warning" | "danger";

export interface ActivityEntry {
  id: string;
  icon: IconKey;
  tone: ActivityTone;
  segments: ActivitySegment[];
  timestamp: string;
}

export interface TopOrganizer {
  id: string;
  name: string;
  revenue: string;
}

export interface OverviewSummary {
  totalAttentionItems: number;
  needsAction: NeedsActionItem[];
  stats: StatCardData[];
  trustSafety: TrustSafetyItem[];
  recentActivity: ActivityEntry[];
  topOrganizers: TopOrganizer[];
}

// --- Platform Revenue chart (separate query, range-scoped) ---

export type RevenueRange = "7d" | "30d" | "12m";

export interface RevenuePoint {
  label: string; // "Mon".."Sun" for 7d/30d, "J".."D" for 12m
  amount: number;
}

export interface PlatformRevenueData {
  range: RevenueRange;
  value: string; // pre-formatted, e.g. "₦4.9M"
  deltaPercent: number;
  deltaCaption: string; // "vs last month"
  series: RevenuePoint[];
}