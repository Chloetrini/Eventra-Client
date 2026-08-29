import { api } from "@/lib/api";
import type { AdminOrganizer, AdminOrganizerStatus, AdminOrganizerDetailsData } from "@/types/admin-organizer";
import { formatDate } from "@/lib/utils";
import type { OrganizerStatusFilterOption } from "@/components/admin/organizer/AdminOrganizerFilterBar";

export interface RawAdminOrganizerListItem {
  _id: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
  isSuspended?: boolean;
  createdAt: string;
  organizerProfile?: {
    businessName?: string;
    category?: string;
    approvalStatus: "pending" | "approved" | "rejected" | "suspended";
    phone?: string;
    bio?: string;
    address?: string;
    accountName?: string;
    accountNumber?: string;
    bankCode?: string;
    bankName?: string;
    isPayoutReady?: boolean;
    cacCertificateUrl?: string;
    directorIdUrl?: string;
    proofOfAddressUrl?: string;
    flagged?: boolean;
    flagReason?: string;
  };
  eventsCount?: number;
  revenue?: number;
}

/**
 * Backend response shape from `getOrganizerDetailForAdmin`
 */
export interface RawAdminOrganizerDetail extends RawAdminOrganizerListItem {
  eventsRunCount?: number;
  ticketsSold?: number;
  revenue?: number;
  paidOut?: number;
  recentEvents?: Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    sold?: number;
    capacity?: number;
  }>;
}

function initialsFrom(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function organizerDisplayName(raw: RawAdminOrganizerListItem): string {
  return raw.organizerProfile?.businessName ?? raw.fullname ?? "Unknown Organizer";
}

function deriveOrganizerStatus(raw: RawAdminOrganizerListItem): AdminOrganizerStatus {
  if (raw.isSuspended || raw.organizerProfile?.approvalStatus === "suspended") {
    return "SUSPENDED";
  }
  switch (raw.organizerProfile?.approvalStatus) {
    case "approved":
      return "VERIFIED";
    case "pending":
      return "PENDING";
    case "rejected":
      return "REJECTED";
    default:
      return "PENDING";
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function mapOrganizerListItem(raw: RawAdminOrganizerListItem): AdminOrganizer {
  const name = organizerDisplayName(raw);
  const totalRevenue = raw.revenue ?? 0;
  const profile = raw.organizerProfile;

  return {
    _id: raw._id,
    name,
    email: raw.email,
    category: profile?.category,
    initials: initialsFrom(name),
    avatarUrl: raw.avatarUrl,
    status: deriveOrganizerStatus(raw),
    eventCount: raw.eventsCount ?? 0,
    rawRevenue: totalRevenue,
    formattedRevenue: formatCurrency(totalRevenue),
    createdAt: formatDate(raw.createdAt), // Formats ISO string into clean UI date
    details: {
      email: raw.email,
      phone: profile?.phone ?? "N/A",
      bio: profile?.bio,
      address: profile?.address,
      joinedDate: formatDate(raw.createdAt),
      cacCertificateUrl: profile?.cacCertificateUrl,
      directorIdUrl: profile?.directorIdUrl,
      proofOfAddressUrl: profile?.proofOfAddressUrl,
      bankDetails: {
        accountName: profile?.accountName,
        accountNumber: profile?.accountNumber,
        bankCode: profile?.bankCode,
        bankName: profile?.bankName,
        isPayoutReady: profile?.isPayoutReady ?? false,
      },
      recentEvents: [],
    },
  };
}

function mapOrganizerDetail(raw: RawAdminOrganizerDetail): AdminOrganizer {
  const base = mapOrganizerListItem(raw);
  const profile = raw.organizerProfile;
  const totalRev = raw.revenue ?? base.rawRevenue;

  const details: AdminOrganizerDetailsData = {
    ...base.details!,
    phone: profile?.phone ?? "N/A",
    bio: profile?.bio,
    address: profile?.address,
    cacCertificateUrl: profile?.cacCertificateUrl,
    directorIdUrl: profile?.directorIdUrl,
    proofOfAddressUrl: profile?.proofOfAddressUrl,
    bankDetails: {
      accountName: profile?.accountName,
      accountNumber: profile?.accountNumber,
      bankCode: profile?.bankCode,
      bankName: profile?.bankName,
      isPayoutReady: profile?.isPayoutReady ?? false,
    },
    recentEvents: (raw.recentEvents ?? []).map((e) => ({
      id: e._id,
      title: e.title ?? "Untitled Event",
      slug: e.slug,
      status: e.status,
      ticketsSold: e.sold ?? 0,
      revenue: 0,
    })),
  };

  return {
    ...base,
    eventCount: raw.eventsRunCount ?? base.eventCount,
    rawRevenue: totalRev,
    formattedRevenue: formatCurrency(totalRev),
    details,
  };
}

// API Calls - Aligned with tsRest controllers and backend response wrappers
export async function fetchAdminOrganizers(
  params: { tab?: OrganizerStatusFilterOption; q?: string; page?: number; limit?: number } = {}
): Promise<{ organizers: AdminOrganizer[]; meta?: any }> {
  const query = new URLSearchParams();
  if (params.tab && params.tab !== "all") query.set("tab", params.tab);
  if (params.q) query.set("q", params.q);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await api.get(`/admin/organizers?${query.toString()}`);
  const body = res.body as { organizers: RawAdminOrganizerListItem[]; meta: any };
  return {
    organizers: body.organizers.map(mapOrganizerListItem),
    meta: body.meta,
  };
}

export async function fetchPendingAdminOrganizers(): Promise<{ organizers: AdminOrganizer[] }> {
  const res = await api.get("/admin/organizers/pending");
  const body = res.body as { organizers: RawAdminOrganizerListItem[] };

  return {
    organizers: body.organizers.map(mapOrganizerListItem)
  };
}

export async function fetchAdminOrganizerDetail(id: string): Promise<AdminOrganizer> {
  const res = await api.get(`/admin/organizers/${id}`);
  return mapOrganizerDetail(res.body as RawAdminOrganizerDetail);
}

// Matches: PATCH /admin/organizers/:id/approve
export async function approveOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/approve`, {});
}

// Matches: PATCH /admin/organizers/:id/reject
export async function rejectOrganizer(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/reject`, { reason });
}

// Matches: PATCH /admin/users/:id/suspend
export async function suspendOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/suspend`, {});
}

// Matches: PATCH /admin/users/:id/unsuspend
export async function unsuspendOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/unsuspend`, {});
}

// Matches: PATCH /admin/organizers/:id/flag
export async function flagOrganizer(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/flag`, { reason });
}

// Matches: PATCH /admin/organizers/:id/unflag
export async function unflagOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/unflag`, {});
}

// Matches: PATCH /admin/reports/flags/organizers/:id/dismiss
export async function dismissOrganizerFlag(id: string): Promise<void> {
  await api.patch(`/admin/reports/flags/organizers/${id}/dismiss`, {});
}