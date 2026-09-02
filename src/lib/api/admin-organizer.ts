import { api } from "@/lib/api";
import type { AdminOrganizer, AdminOrganizerStatus, AdminOrganizerDetailsData } from "@/types/admin-organizer";
import { formatDate, formatNaira } from "@/lib/utils";
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

export interface FetchAdminOrganizersParams {
  status?: OrganizerStatusFilterOption;
  tab?: OrganizerStatusFilterOption;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminOrganizersResponse {
  organizers: AdminOrganizer[];
  meta?: {
    totalCount: number;
    page: number;
    limit: number;
    hasMore?: boolean;
  };
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

function formatCurrency(amount: number, currency?: string): string {
  return formatNaira(amount, currency ?? "Naira");
}

function mapOrganizerListItem(raw: RawAdminOrganizerListItem, currency?: string): AdminOrganizer {
  const name = organizerDisplayName(raw);
  const totalRevenue = raw.revenue ?? 0;
  const profile = raw.organizerProfile;

  return {
    _id: raw._id,
    name,
    email: raw.email,
    isSuspended: raw.isSuspended ?? false,
    category: profile?.category,
    initials: initialsFrom(name),
    avatarUrl: raw.avatarUrl,
    status: deriveOrganizerStatus(raw),
    eventCount: raw.eventsCount ?? 0,
    rawRevenue: totalRevenue,
    formattedRevenue: formatCurrency(totalRevenue, currency),
    currency,
    createdAt: formatDate(raw.createdAt),
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

function mapOrganizerDetail(raw: RawAdminOrganizerDetail, currency?: string): AdminOrganizer {
  const base = mapOrganizerListItem(raw, currency);
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
    formattedRevenue: formatCurrency(totalRev, currency),
    details,
  };
}

// API Calls
export async function fetchAdminOrganizers(
  params: FetchAdminOrganizersParams = {}
): Promise<AdminOrganizersResponse> {
  const activeStatus = params.status ?? params.tab;
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (activeStatus && activeStatus !== "all") {
    query.set("tab", activeStatus);
  }
  if (params.q) {
    query.set("q", params.q);
  }

  const res = await api.get(`/admin/organizers?${query.toString()}`);
  const body = res.body as {
    organizers: RawAdminOrganizerListItem[];
    currency?: string;
    totalCount?: number;
    meta?: {
      totalCount: number;
      page: number;
      limit: number;
      hasMore?: boolean;
    };
  };

  const organizers = body.organizers.map((raw) =>
    mapOrganizerListItem(raw, body.currency)
  );

  const meta =
    body.meta ??
    (body.totalCount !== undefined
      ? {
          totalCount: body.totalCount,
          page,
          limit,
          hasMore: page * limit < body.totalCount,
        }
      : undefined);

  return { organizers, meta };
}

export async function fetchPendingAdminOrganizers(): Promise<{
  organizers: AdminOrganizer[];
}> {
  const res = await api.get("/admin/organizers/pending");
  const body = res.body as {
    organizers: RawAdminOrganizerListItem[];
    currency?: string;
  };

  return {
    organizers: body.organizers.map((raw) =>
      mapOrganizerListItem(raw, body.currency)
    ),
  };
}

export async function fetchAdminOrganizerDetail(
  id: string
): Promise<AdminOrganizer> {
  const res = await api.get(`/admin/organizers/${id}`);
  const body = res.body as RawAdminOrganizerDetail & { currency?: string };
  return mapOrganizerDetail(body, body.currency);
}

export async function approveOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/approve`, {});
}

export async function rejectOrganizer(
  id: string,
  reason?: string
): Promise<void> {
  await api.patch(`/admin/organizers/${id}/reject`, { reason });
}

export async function suspendOrganizer({
  id,
  reason,
}: {
  id: string;
  reason?: string;
}): Promise<void> {
  await api.patch(`/admin/organizers/${id}/suspend`, { reason });
}

export async function unsuspendOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/unsuspend`, {});
}

export async function flagOrganizer(
  id: string,
  reason?: string
): Promise<void> {
  await api.patch(`/admin/organizers/${id}/flag`, { reason });
}

export async function unflagOrganizer(id: string): Promise<void> {
  await api.patch(`/admin/organizers/${id}/unflag`, {});
}

export async function dismissOrganizerFlag(id: string): Promise<void> {
  await api.patch(`/admin/reports/flags/organizers/${id}/dismiss`, {});
}