import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followOrganizer, unfollowOrganizer } from "@/lib/user-api";

export function useFollowOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => followOrganizer(organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useUnfollowOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => unfollowOrganizer(organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}