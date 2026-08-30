import { api } from "@/lib/api";

// ---------------------------------------------------------------------
// Update the signed-in user's profile — PATCH /users/profile
// ---------------------------------------------------------------------
export type CurrencyPreference = "Naira" | "Dollar" | "Cedis" | "Pound";

export async function updateProfile(payload: {
  fullname?: string;
  phone?: string;
  city?: string;
  // The signed-in user's own display currency — available to every role
  // (attendee, organizer, admin), not attendee-only. The backend already
  // accepts this on the same endpoint (see updateProfile,
  // user.controller.ts) and every price-showing page already reads it
  // back via resolveViewerCurrency (lib/viewerCurrency.ts) — this was
  // just never exposed as a control on this side. Display-only: never
  // converts or rewrites any stored price.
  currencyPreference?: CurrencyPreference;
  currentPassword?: string;
  newPassword?: string;
}) {
  // The backend treats each of these as "optional, but if present must be
  // non-empty" (min-length validation on fullname/phone/city) — an empty
  // string from a blank form field fails that, even though "field wasn't
  // touched" was the intent. Drop empty strings so they're omitted
  // entirely instead of sent as "".
  const cleaned = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
  const res = await api.patch("/users/profile", cleaned);
  return res.body;
}

// ---------------------------------------------------------------------
// Upload/replace the signed-in user's avatar — POST /users/avatar
// (multipart/form-data, field name "image", per the backend contract)
// ---------------------------------------------------------------------
export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.upload("/users/avatar", formData);
  return res.body;
}
