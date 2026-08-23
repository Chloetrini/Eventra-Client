import { api } from "@/lib/api";

// The backend is deployed on Vercel, whose serverless functions hard-cap
// request bodies at 4.5MB — anything larger gets rejected by the platform
// itself, before the request ever reaches our Express app or multer's own
// (much higher) 20MB limit. A platform-level rejection like that carries no
// CORS headers and no JSON body, so it shows up in the browser as an opaque
// network/CORS failure instead of a real error message. Catching oversized
// files here — before the request goes out — turns that into an actual
// "image too large" message instead.
const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024; // 4MB, safely under Vercel's 4.5MB cap

function assertUploadableSize(file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`Image is too large (${sizeMb}MB). Please use an image under 4MB.`);
  }
}

export async function uploadEventCoverImage(file: File): Promise<string> {
  assertUploadableSize(file);
  const formData = new FormData();
  formData.append("image", file);

  // Goes through api.upload (not a raw axiosClient.post) so a real backend
  // error — wrong file type, expired session, etc — surfaces its actual
  // message instead of getting swallowed into a generic axios error.
  const response = await api.upload("/uploads/event-cover", formData);
  const body = response.body as { url: string; publicId: string };
  return body.url;
}
export async function uploadLineupPhoto(file: File): Promise<string> {
  assertUploadableSize(file);
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.upload("/uploads/lineup-photo", formData);
  const body = response.body as { url: string; publicId: string };
  return body.url;
}

// Screenshots attached to a refund request (RefundsForm's "evidence"
// field). Deliberately a separate function/endpoint from
// uploadLineupPhoto/uploadEventCoverImage — those both require an
// organizer session on the backend, but a refund request comes from an
// attendee (or an unauthenticated guest ticket-holder), so evidence needs
// its own session-free upload route. See uploads/refund-evidence's own
// comment in the backend's routes/upload.routes.ts.
export async function uploadRefundEvidence(file: File): Promise<string> {
  assertUploadableSize(file);
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.upload("/uploads/refund-evidence", formData);
  const body = response.body as { url: string; publicId: string };
  return body.url;
}

function assertDocumentUploadableSize(file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File is too large (${sizeMb}MB). Please use a file under 4MB.`);
  }
}

export type VerificationDocumentType = "cacCertificate" | "directorId" | "proofOfAddress";

// Backs the onboarding "verification documents" step — same Vercel
// body-size ceiling as the image uploads above, but the backend accepts a
// PDF here too (uploadDocument/'auto' resource type), not just images. One
// endpoint shared by all three document types; `documentType` tells the
// backend which Cloudinary subfolder to file it under, and the returned
// publicId lets the profile PATCH clean up the old file when a document is
// replaced — see upsertOrganizerProfile.
export async function uploadVerificationDocument(
  file: File,
  documentType: VerificationDocumentType
): Promise<{ url: string; publicId: string }> {
  assertDocumentUploadableSize(file);
  const formData = new FormData();
  formData.append("document", file);
  formData.append("documentType", documentType);

  const response = await api.upload("/uploads/verification-document", formData);
  const body = response.body as { url: string; publicId: string };
  return body;
}
