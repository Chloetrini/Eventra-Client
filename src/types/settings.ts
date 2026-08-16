export interface BankAccount {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
}

export interface NotificationPreferences {
  newTicketSales: boolean;
  dailySalesSummary: boolean;
  payoutConfirmations: boolean;
  eventApprovals: boolean;
}

export interface OrganizationSettings {
  organizationName: string;
  city: string;
  publicEmail: string;
  phone: string;
  bankAccount: BankAccount | null;
  notifications: NotificationPreferences;
}
