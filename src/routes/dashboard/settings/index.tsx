import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getSettings,
  updateBankAccount,
  updateNotificationPreferences,
  updateOrganizationProfile,
} from "@/lib/settings";
import { useOrganizerBankStatus, useOrganizerProfileComplete, useOrganizerStatus } from "@/lib/organizer-api";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Landmark, CheckCircle2, Loader2 } from "lucide-react";
import type { BankAccount, OrganizationSettings } from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { AddBankAccountDialog } from "@/components/add-bank-account";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const queryClient = useQueryClient();
  const { status: organizerStatus } = useOrganizerStatus();
  const { bankStatus } = useOrganizerBankStatus();
  const { isProfileComplete } = useOrganizerProfileComplete();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const [formData, setFormData] = useState<OrganizationSettings | null>(null);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const invalidateSettings = () =>
    queryClient.invalidateQueries({ queryKey: ["settings"] });

  const saveProfileMutation = useMutation({
    mutationFn: updateOrganizationProfile,
    onSuccess: () => {
      toast.success("Organization profile updated");
      invalidateSettings();
      // Approval status / payout-readiness banners elsewhere read this.
      queryClient.invalidateQueries({ queryKey: ["organizer-status"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-profile"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not save your profile");
    },
  });

  const saveBankAccountMutation = useMutation({
    mutationFn: updateBankAccount,
    onSuccess: (_, bankAccount) => {
      toast.success("Bank account saved");
      setFormData((prev) => (prev ? { ...prev, bankAccount } : prev));
      invalidateSettings();
      queryClient.invalidateQueries({ queryKey: ["organizer-status"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-profile"] });
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Could not save your bank account"
      );
    },
  });

  const notificationsMutation = useMutation({
    mutationFn: (vars: {
      notifications: OrganizationSettings["notifications"];
      previous: OrganizationSettings;
    }) => updateNotificationPreferences(vars.notifications),
    onError: (error: unknown, variables) => {
      // Roll back the optimistic toggle if the save actually failed.
      setFormData(variables.previous);
      toast.error(
        error instanceof Error ? error.message : "Could not save notification preferences"
      );
    },
  });

  const handleSaveBankAccount = (bankAccount: BankAccount) => {
    saveBankAccountMutation.mutate(bankAccount);
  };

  const handleSaveProfile = () => {
    if (!formData) return;
    saveProfileMutation.mutate({
      organizationName: formData.organizationName,
      city: formData.city,
      publicEmail: formData.publicEmail,
      phone: formData.phone,
    });
  };

  const handleToggleNotification = (
    key: keyof OrganizationSettings["notifications"],
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key],
        },
      };
      notificationsMutation.mutate({ notifications: next.notifications, previous: prev });
      return next;
    });
  };

  if (isLoading) {
    return (
      <p className="text-center py-12 text-sm text-muted-foreground">
        Loading settings
      </p>
    );
  }

  if (isError || !formData) {
    return (
      <p className="text-center py-12 text-sm text-destructive">
        Something went wrong loading settings.
      </p>
    );
  }

  const isVerified = organizerStatus === "verified";

  return (
    <div className="max-w-[1147px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner status={organizerStatus}
        bankStatus={bankStatus}
        isProfileComplete={isProfileComplete} />

      <div>
        <p className="text-[16px] font-medium font-space tracking-wide text-[#0F6E56] dark:text-[#4ADE80]">
          Account
        </p>
        <h1 className="text-[28px] leading-[30px] font-grotesk font-bold text-foreground mt-1">
          Settings
        </h1>
        <p className="text-[15px] text-muted-foreground mt-1">
          Your organization profile, bank account and verification.
        </p>
      </div>

      {/* Under review / Verified notice card */}
      <div className="flex items-start gap-3 min-h-[78px] bg-[#E4F1EB] dark:bg-[#0F6E56]/15 border border-[#E4F1EB] dark:border-[#0F6E56]/30 rounded-[10px] p-[10px]">
        <div className="bg-card p-4 rounded-[6px] shrink-0">
          {isVerified ? (
            <CheckCircle2 className="size-5 text-[#0F6E56] dark:text-[#4ADE80]" />
          ) : (
            <Clock className="size-5 text-[#0F6E56] dark:text-[#4ADE80]" />
          )}
        </div>
        <div>
          <p className="text-[20px] font-bold text-foreground font-grotesk">
            {isVerified ? "Verified" : "Under review"}
          </p>
          <p className="text-[16px] text-muted-foreground mt-1">
            {isVerified
              ? "Your organization is verified. Paid events are now unlocked."
              : "We're checking your details, usually within a day. Free events can go live now."}
          </p>
        </div>
      </div>

      {/* Organization profile */}
      <div className="border border-border rounded-[15px] p-6">
        <h2 className="font-grotesk text-[20px] font-bold leading-[24px] text-foreground mb-2">
          Organization profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-3">
          <div>
            <Label htmlFor="organizationName" className="text-[16px] text-foreground font-sans">Organization name</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  organizationName: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-[16px] text-foreground font-sans">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  city: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="publicEmail" className="text-[16px] text-foreground font-sans">Public email</Label>
            <Input
              id="publicEmail"
              value={formData.publicEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicEmail: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-[16px] text-foreground font-sans">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          disabled={saveProfileMutation.isPending}
          className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-white text-[18px] py-[24px] px-[22px] p-6 mt-4 w-full sm:w-auto"
        >
          {saveProfileMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>

      {/* Bank account & payouts */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-[20px] font-bold font-grotesk text-foreground">
            Bank account & payouts
          </h2>
          <Badge
            className={
              formData.bankAccount
                ? "bg-[#F8F5ED] dark:bg-white/5 text-muted-foreground hover:bg-[#E4F1EB] dark:hover:bg-white/10 text-[12px]"
                : "bg-[#F8F5ED] dark:bg-white/5 text-muted-foreground hover:bg-[#F4DFB6] dark:hover:bg-white/10 text-[12px]"
            }
          >
            {formData.bankAccount ? "VERIFIED" : "NOT ADDED"}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#F8F5ED] dark:bg-white/5 rounded-lg p-3 shrink-0">
              <Landmark className="size-5 text-muted-foreground" />
            </div>

            <div>
              {formData.bankAccount ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {formData.bankAccount.bankName}: {"*".repeat(6)}
                    {formData.bankAccount.accountNumber.slice(-4)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Holder: {formData.bankAccount.accountHolderName}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">
                    No bank account yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Required for paid events & payouts
                  </p>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={() => setBankDialogOpen(true)}
            variant={formData.bankAccount ? "outline" : "default"}
            className={
              formData.bankAccount
                ? "shrink-0"
                : "bg-[#0F6E56] hover:bg-[#0F6E56]/90 font-bold text-[18px] text-white shrink-0 px-[16px] py-[24px]"
            }
          >
            {formData.bankAccount ? "Change" : "Add bank account"}
          </Button>
        </div>

        <AddBankAccountDialog
          open={bankDialogOpen}
          onOpenChange={setBankDialogOpen}
          onSave={handleSaveBankAccount}
        />
      </div>

      {/* Notifications */}
      <div className="border border-border rounded-lg p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Notifications
        </h2>

        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                New ticket sales & RSVPs
              </p>
              <p className="text-xs text-muted-foreground">
                Email me when someone buys or reserves
              </p>
            </div>
            <Switch
              checked={formData.notifications.newTicketSales}
              onCheckedChange={() => handleToggleNotification("newTicketSales")}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Daily sales summary
              </p>
              <p className="text-xs text-muted-foreground">
                A recap of each event's performance
              </p>
            </div>
            <Switch
              checked={formData.notifications.dailySalesSummary}
              onCheckedChange={() =>
                handleToggleNotification("dailySalesSummary")
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Payout confirmations
              </p>
              <p className="text-xs text-muted-foreground">
                When money lands in your account
              </p>
            </div>
            <Switch
              checked={formData.notifications.payoutConfirmations}
              onCheckedChange={() =>
                handleToggleNotification("payoutConfirmations")
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Event approvals
              </p>
              <p className="text-xs text-muted-foreground">
                When an admin approves or rejects an event
              </p>
            </div>

            <Switch
              checked={formData.notifications.eventApprovals}
              onCheckedChange={() => handleToggleNotification("eventApprovals")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
