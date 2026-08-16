import { api } from "@/services/api";

// ---------------------------------------------------------------------
// Update the signed-in user's profile — PATCH /users/profile
// ---------------------------------------------------------------------
export async function updateProfile(payload: {
  fullname?: string;
  phone?: string;
  city?: string;
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
