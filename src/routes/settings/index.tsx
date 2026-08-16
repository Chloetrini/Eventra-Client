import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/api/settings";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Landmark, CheckCircle2 } from "lucide-react";
import type { BankAccount, OrganizationSettings } from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { AddBankAccountDialog } from "@/components/add-bank-account";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const [formData, setFormData] = useState<OrganizationSettings | null>(null);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleSaveBankAccount = (bankAccount: BankAccount) => {
    setFormData((prev) => (prev ? { ...prev, bankAccount } : prev));
  };
  const handleSaveProfile = () => {
    console.log("Saving profile", formData);
  };

  const handleToggleNotification = (
    key: keyof OrganizationSettings["notifications"],
  ) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            notifications: {
              ...prev.notifications,
              [key]: !prev.notifications[key],
            },
          }
        : prev,
    );
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
      <p className="text-center py-12 text-sm text-red-500">
        Something went wrong loading settings.
      </p>
    );
  }

  return (
    <div className="max-w-[1147px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner />

      <div>
        <p className="text-[16px] font-medium font-space tracking-wide text-[#0F6E56]">
          Account
        </p>
        <h1 className="text-[28px] leading-[30px] font-grotesk font-bold text-[#1A1523] mt-1">
          Settings
        </h1>
        <p className="text-[15px] text-[#4A4451] mt-1">
          Your organization profile, bank account and verification.
        </p>
      </div>

     {/* Under review / Verified notice card */}
<div
  className={
    formData.bankAccount
      ? "flex items-start gap-3 h-[78px] bg-[#E4F1EB] border border-[#E4F1EB] rounded-[10px] p-[10px]"
      : "flex items-start gap-3 h-[78px] bg-[#E4F1EB] border border-[#E4F1EB] rounded-[10px] p-[10px]"
  }
>
  <div className="bg-white p-4 rounded-[6px] shrink-0">
    {formData.bankAccount ? (
      <CheckCircle2 className="size-5 text-[#0F6E56]" />
    ) : (
      <Clock className="size-5 text-[#0F6E56]" />
    )}
  </div>
  <div>
    <p className="text-[20px] font-bold text-[#1A1523] font-grotesk">
      {formData.bankAccount ? "Verified" : "Under review"}
    </p>
    <p className="text-[16px] text-[#4A4451] mt-1">
      {formData.bankAccount
        ? "Your organization is verified. Paid events are now unlocked."
        : "We're checking your details, usually within a day. Free events can go live now."}
    </p>
  </div>
</div>
      {/* Organization profile */}
      <div className="border border-[#E8E6E0] rounded-[15px] p-6">
        <h2 className="font-grotesk text-[20px] font-bold leading-[24px] text-[#1A1523] mb-2">
          Organization profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-1 pt-3">
          <div>
            <Label htmlFor="organizationName" className="text-[16px] text-[#232323] font-sans">Organization name</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  organizationName: e.target.value,
                })
              }
              className="mt-1 border border-[#C3C9D3] text-[#98A2B3]"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-[16px] text-[#232323] font-sans">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  city: e.target.value,
                })
              }
              className="mt-1 border border-[#C3C9D3] text-[#98A2B3]"
            />
          </div>

          <div>
            <Label htmlFor="publicEmail" className="text-[16px] text-[#232323] font-sans">Public email</Label>
            <Input
              id="publicEmail"
              value={formData.publicEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicEmail: e.target.value,
                })
              }
              className="mt-1 border border-[#C3C9D3] text-[#98A2B3]"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-[16px] text-[#232323] font-sans">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="mt-1 border border-[#C3C9D3] text-[#98A2B3]"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-[#FFFFFF] text-[18px] py-[24px] px-[22px] p-6 mt-4"
        >
          Save changes
        </Button>
      </div>

      {/* Bank account & payouts */}
      <div className="border border-[#E8E6E0] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-bold font-grotesk text-[#1A1523]">
            Bank account & payouts
          </h2>
          <Badge
            className={
              formData.bankAccount
                ? "bg-[#F8F5ED] text-[#4A4451] hover:bg-[#E4F1EB] text-[12px]"
                : "bg-[#F8F5ED] text-[#4A4451] hover:bg-[#F4DFB6] text-[12px]"
            }
          >
            {formData.bankAccount ? "VERIFIED" : "NOT ADDED"}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4 border-t-1 p-2">
          <div className="flex items-center gap-3 ">
            <div className="bg-[#F8F5ED] rounded-lg p-3">
              <Landmark className="size-5 text-[#4A4451]" />
            </div>

           <div>
        {formData.bankAccount ? (
          <>
            <p className="text-sm font-medium text-[#1A1523]">
              {formData.bankAccount.bankName}: {"*".repeat(6)}
              {formData.bankAccount.accountNumber.slice(-4)}
            </p>
            <p className="text-xs text-[#4A4451]">
              Holder: {formData.bankAccount.accountHolderName}
            </p>
          </>
        ) : (
      <>
            <p className="text-sm font-medium text-[#1A1523]">
              No bank account yet
            </p>
            <p className="text-xs text-[#4A4451]">
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
          : "bg-[#0F6E56] hover:bg-[#0F6E56] font-bold text-[18px] text-[#FFFFFF] shrink-0 px-[16px] py-[24px]"
      }
    >
      {formData.bankAccount ? "Change" : "Add bank account"}
    </Button>
  </div>

  <AddBankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        onSave={handleSaveBankAccount}
        defaultAccountHolderName={formData.organizationName}
      />
    </div>

      {/* Notifications */}

      <div className="border border-[#E8E6E0] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#1A1523] mb-4">
          Notifications
        </h2>

        <div className="divide-y divide-[#E8E6E0]">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-[#1A1523]">
                New ticket sales & RSVPs
              </p>
              <p className="text-xs text-[#4A4451]">
                Email me when someone buys or reserves
              </p>
            </div>
            <Switch
              checked={formData.notifications.newTicketSales}
              onCheckedChange={() => handleToggleNotification("newTicketSales")}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-[#1A1523]">
                Daily sales summary
              </p>
              <p className="text-xs text-[#4A4451]">
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

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-[#1A1523]">
                Payout confirmations
              </p>
              <p className="text-xs text-[#4A4451]">
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

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-[#1A1523]">
                Event approvals
              </p>
              <p className="text-xs text-[#4A4451]">
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
