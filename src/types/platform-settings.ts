// Powers the Settings page's Commission rate and Platform Configuration
// cards. Mirrors PlatformSettings on the backend (models/platformSettings.ts)
// field-for-field — currency/payoutHold are kept as the exact display
// strings the page's <Select> options already use as values, so there's no
// translation layer between what's sent and what's rendered.
export interface PlatformSettings {
  platformFeePercent: number;
  currency: "Naira" | "Dollar" | "Cedis" | "Pound";
  payoutHold: "3 days" | "5 days" | "7 days";
  autoApproveEvents: boolean;
  autoApprovePromotions: boolean;
  maintenanceMode: boolean;
}
