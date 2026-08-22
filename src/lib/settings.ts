import { api } from "@/lib/api";
import type {
  BankAccount,
  NotificationPreferences,
  OrganizationSettings,
} from "@/types/settings";

// ─── Real backend shapes ────────────────────────────────────────
// GET/PATCH /organizers/profile, GET/PATCH /organizers/notification-preferences,
// GET /organizers/banks, POST /organizers/resolve-account
// (organizer.controller.ts / organizer.routes.ts)

type RealOrganizerProfile = {
  businessName?: string;
  city?: string;
  publicEmail?: string;
  contactPhone?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
} | null;

type RealNotificationPreferences = {
  newSalesRsvps: boolean;
  dailySalesSummary: boolean;
  payoutConfirmations: boolean;
  eventApprovals: boolean;
};

function mapProfileToBankAccount(profile: RealOrganizerProfile): BankAccount | null {
  if (!profile?.bankName || !profile.bankCode || !profile.accountNumber || !profile.accountName) {
    return null;
  }
  return {
    accountHolderName: profile.accountName,
    bankName: profile.bankName,
    bankCode: profile.bankCode,
    accountNumber: profile.accountNumber,
  };
}

function mapNotifications(prefs: RealNotificationPreferences): NotificationPreferences {
  return {
    newTicketSales: prefs.newSalesRsvps,
    dailySalesSummary: prefs.dailySalesSummary,
    payoutConfirmations: prefs.payoutConfirmations,
    eventApprovals: prefs.eventApprovals,
  };
}

/** Powers the Settings page — the organizer's profile + notification preferences. */
export async function getSettings(): Promise<OrganizationSettings> {
  const [profileRes, notifRes] = await Promise.all([
    api.get("/organizers/profile"),
    api.get("/organizers/notification-preferences"),
  ]);

  const profile = profileRes.body as RealOrganizerProfile;
  const notifications = notifRes.body as RealNotificationPreferences;

  return {
    organizationName: profile?.businessName ?? "",
    city: profile?.city ?? "",
    publicEmail: profile?.publicEmail ?? "",
    phone: profile?.contactPhone ?? "",
    bankAccount: mapProfileToBankAccount(profile),
    notifications: mapNotifications(notifications),
  };
}

/** "Save changes" on the organization-profile card. */
export async function updateOrganizationProfile(fields: {
  organizationName: string;
  city: string;
  publicEmail: string;
  phone: string;
}): Promise<void> {
  await api.patch("/organizers/profile", {
    businessName: fields.organizationName,
    city: fields.city,
    publicEmail: fields.publicEmail,
    contactPhone: fields.phone,
  });
}

/** Adding or changing the payout bank account. */
export async function updateBankAccount(bankAccount: BankAccount): Promise<void> {
  await api.patch("/organizers/profile", {
    bankName: bankAccount.bankName,
    bankCode: bankAccount.bankCode,
    accountNumber: bankAccount.accountNumber,
    accountName: bankAccount.accountHolderName,
  });
}

export async function updateNotificationPreferences(
  notifications: NotificationPreferences
): Promise<void> {
  await api.patch("/organizers/notification-preferences", {
    newSalesRsvps: notifications.newTicketSales,
    dailySalesSummary: notifications.dailySalesSummary,
    payoutConfirmations: notifications.payoutConfirmations,
    eventApprovals: notifications.eventApprovals,
  });
}

/** Real Nigerian bank list (via Paystack), for the "Add bank account" dialog. */
export async function fetchBanks(): Promise<{ name: string; code: string }[]> {
  const res = await api.get("/organizers/banks");
  return res.body as { name: string; code: string }[];
}

/**
 * Confirms the account holder's name before saving, mirroring the backend's
 * own intent (see resolveBankAccount in organizer.controller.ts) — the form
 * fills in the account holder's name from this response rather than letting
 * the organizer type it themselves, so a mistyped account number is caught
 * immediately instead of silently breaking a payout later.
 */
export async function resolveBankAccount(
  accountNumber: string,
  bankCode: string
): Promise<{ accountName: string }> {
  const res = await api.post("/organizers/resolve-account", { accountNumber, bankCode });
  return res.body as { accountName: string };
}
