import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlatformSettings, updatePlatformSettings } from "@/lib/api/platform-settings";
import type { PlatformSettings } from "@/types/platform-settings";

export const platformSettingsKeys = {
  all: ["admin", "platform-settings"] as const,
};

export function usePlatformSettings() {
  return useQuery({
    queryKey: platformSettingsKeys.all,
    queryFn: fetchPlatformSettings,
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<PlatformSettings>) => updatePlatformSettings(updates),
    onSuccess: data => {
      // The PATCH response is the full, fresh settings row — write it
      // straight into the cache instead of invalidating, so every control
      // reflects the save immediately with no refetch round-trip.
      queryClient.setQueryData(platformSettingsKeys.all, data);
    },
  });
}
