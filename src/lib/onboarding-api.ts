import { api } from "@/lib/api";

export async function saveOrganizerProfile(payload: {
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
  cacCertificateUrl?: string;
  cacCertificatePublicId?: string;
  directorIdUrl?: string;
  directorIdPublicId?: string;
  proofOfAddressUrl?: string;
  proofOfAddressPublicId?: string;
}) {
  const res = await api.patch("/organizers/profile", payload);
  return res.body;
}

export async function submitOrganizerProfileForReview(payload: { agreedToTerms: boolean }) {
  const res = await api.post("/organizers/profile/submit", payload);
  return res.body;
}

export async function listBanks() {
  const res = await api.get("/organizers/banks");
  return res.body as { name: string; code: string }[];
}

export async function resolveBankAccount(payload: { accountNumber: string; bankCode: string }) {
  const res = await api.post("/organizers/resolve-account", payload);
  return res.body as { accountName: string };
}
