import { settings } from "@/lib/dummy-settings";
import type { OrganizationSettings } from "@/types/settings";

export async function getSettings() : Promise<OrganizationSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return settings;
}