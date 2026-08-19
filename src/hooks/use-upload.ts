import { useMutation } from "@tanstack/react-query";
import { uploadEventCoverImage, uploadLineupPhoto } from "@/lib/upload-api";

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
