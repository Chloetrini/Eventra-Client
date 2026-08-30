export type FlagTargetType = "event" | "organizer";

// Matches the shape listFlags actually returns (admin.controller.ts) — one
// row per flagged target, merged from two sources: targets with an open
// Report (the normal case — someone reported it, which auto-flagged it)
// and targets an admin flagged by hand with no report behind them at all
// (hasReports: false, reportsCount: 0). See that function's doc comment
// for the full merge logic.
export interface Flag {
  targetType: FlagTargetType;
  targetId: string;
  title: string;
  flagReason?: string;
  reportsCount: number;
  latestReportedAt: string | null;
  latestReason: string | null;
  hasReports: boolean;
}

// One row from the Report collection — what actually got typed into the
// report form. Reused for both the event and organizer flag-detail pages.
export interface FlagReportEntry {
  _id: string;
  reporterName: string;
  reason: string;
  status: "open" | "dismissed" | "actioned";
  createdAt: string;
}

export interface EventFlagDetail {
  event: {
    _id: string;
    title: string;
    slug: string;
    flagged: boolean;
    flagReason?: string;
    status: string;
    category?: { _id: string; name: string } | null;
    startDate?: string;
    minPrice: number;
    type: "free" | "paid";
    venue: {
      name: string;
      joinLink?: string | null;
      address?: string;
      city?: string;
    } | null;
    organizer?: {
      _id: string;
      fullname: string;
      email: string;
      organizerProfile?: { businessName?: string };
    };
  };
  reports: FlagReportEntry[];
  // The admin's resolved display currency — event.minPrice above is
  // already converted into it server-side (see getEventFlagDetail,
  // admin.controller.ts). Was missing entirely, so the "Ticket price" line
  // on the flag-detail page always showed ₦ no matter what currency was
  // selected in Settings.
  currency: string;
}

export interface OrganizerFlagDetail {
  organizer: {
    _id: string;
    fullname: string;
    email: string;
    organizerProfile?: {
      businessName?: string;
      flagged?: boolean;
      flagReason?: string;
    };
  };
  reports: FlagReportEntry[];
}

// Raw shape of one entry from GET /admin/reports/audit-log, as actually
// returned by listAuditLog (admin.controller.ts). action/target/amount are
// pre-derived server-side (from the entry's related event/organizer/
// refund/dispute) specifically so this table can keep its original four
// columns — ACTION / TARGET / ADMIN / WHEN — without flattening into one
// message column. `message` is also included for anywhere that still wants
// one line of text (e.g. the Overview page's Recent Activity card, via its
// own endpoint).
export interface AuditLogEntry {
  id: string;
  type: string;
  action: string;
  target: string;
  amount?: string;
  message: string;
  actorName: string;
  createdAt: string;
}

export type UserReport = {
    _id: string
    targetType: "event" | "organizer"
    event: string
    organizer?: string
    reportedBy: string
    reporterName: string
    reason: string
    category: string
    evidence?: {
        url: string | null
    }[]
    additionalInformation?: string
    createdAt: string
    updatedAt: string
}

export type UserReportPopulated = Omit<UserReport, "event" | "organizer"> & {
    event?: {
        _id: string
        title: string
    }
    organizer?: {
        _id: string
        fullname: string
        email: string
    }
}
