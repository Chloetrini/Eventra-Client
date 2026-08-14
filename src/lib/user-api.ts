import { api } from "@/lib/api";

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
  const res = await api.patch("/users/profile", payload);
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
