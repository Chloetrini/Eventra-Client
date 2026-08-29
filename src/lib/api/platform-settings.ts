import { api } from "@/lib/api";
import type { PlatformSettings } from "@/types/platform-settings";

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const res = await api.get("/admin/settings/platform");
  return res.body as PlatformSettings;
}

// Partial on purpose — the Settings page saves each control independently
// (commission rate's own Save button, a Select's onValueChange, a toggle's
// onCheckedChange), matching what the backend's PATCH accepts.
export async function updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
  const res = await api.patch("/admin/settings/platform", updates);
  return res.body as PlatformSettings;
}
