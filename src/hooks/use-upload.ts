import { useMutation } from "@tanstack/react-query";
import {
  uploadEventCoverImage,
  uploadLineupPhoto,
  uploadRefundEvidence,
  uploadVerificationDocument,
  type VerificationDocumentType,
} from "@/lib/upload-api";

// Wraps the two image-upload writes in useMutation instead of a raw call
// + local isUploading useState — same treatment as every other write in
// the app now. ImageUploadInput can appear multiple times on one form
// (e.g. one per lineup member), so each hook call is scoped to its own
// component instance, same as any other per-instance mutation.

export function useUploadEventCoverImage() {
  return useMutation({
    mutationFn: (file: File) => uploadEventCoverImage(file),
  });
}

export function useUploadLineupPhoto() {
  return useMutation({
    mutationFn: (file: File) => uploadLineupPhoto(file),
  });
}

export function useUploadRefundEvidence() {
  return useMutation({
    mutationFn: (file: File) => uploadRefundEvidence(file),
  });
}

// One hook shared by all three verification-document upload slots (CAC
// certificate, director ID, proof of address) — each call site on the
// verification step gets its own hook instance, so uploading one document
// doesn't show a spinner on the other two.
export function useUploadVerificationDocument() {
  return useMutation({
    mutationFn: ({ file, documentType }: { file: File; documentType: VerificationDocumentType }) =>
      uploadVerificationDocument(file, documentType),
  });
}
