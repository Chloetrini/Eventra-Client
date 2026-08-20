import { useMutation } from "@tanstack/react-query";
import { updateProfile, uploadAvatar } from "@/lib/user-api";

// Both writes here used to call their lib function directly with hand-rolled
// loading state. The signed-in user's cache actually lives in AuthContext
// (setUser), not react-query, so these hooks don't invalidate a query key —
// the caller still passes the fresh user into setUser on success — but they
// give both actions the standard useMutation shape (isPending, mutateAsync)
// instead of a local isLoading useState.

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
  });
}
