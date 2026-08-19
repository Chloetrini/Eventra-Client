import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clock from "@/assets/Vector.png"
import bank from "@/assets/bank-dashboard.png"
import completeAccount from "@/assets/complete-account.png"
import { useNavigate } from "react-router";

type OrganizerAccountStatus = "unverified" | "pending" | "verified" | "rejected";
type BankAccountStatus = "unverified" | "verified";

interface AccountReviewBannerProps {
  status: OrganizerAccountStatus;
  bankStatus: BankAccountStatus;
  isProfileComplete: boolean;
  onDismiss?: () => void;
}

type BannerConfig = {
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

type BannerKind = "completeAccount" | "bankDetails" | "pending" | "rejected";

const STATUS_CONFIG: Record<BannerKind, BannerConfig> = {
  completeAccount: {
    title: "Finish setting up your account",
    badge: "UNVERIFIED",
    description:
      "Complete your organizer profile to publish paid events and receive payouts. Free events can go live without it.",
    actionLabel: "Complete account",
    actionTo: "/onboarding/organisation",
  },
  bankDetails: {
    title: "Add your bank details",
    badge: "ACTION NEEDED",
    description:
      "You're almost done — add your bank details to publish paid events and receive payouts.",
    actionLabel: "Add bank details",
    actionTo: "/dashboard/settings",
  },
  pending: {
    title: "Your account is under review",
    badge: "PENDING",
    description:
      "We usually approve within a day. Free events can go live now, paid events unlock once you're verified.",
    actionLabel: "View status",
    actionTo: "/dashboard/overview",
  },
  rejected: {
    title: "Your application wasn't approved",
    badge: "REJECTED",
    description:
      "Check your email for details, or reach out to support to find out what needs fixing.",
    actionLabel: "Contact support",
    actionTo: "/contact",
  },
};

function getBannerKind(
  status: OrganizerAccountStatus,
  bankStatus: BankAccountStatus,
  isProfileComplete: boolean
): BannerKind | null {
  if (status === "verified") return null;
  if (status === "rejected") return "rejected";
  if (status === "pending") return bankStatus === "unverified" ? "bankDetails" : "pending";
  // status === "unverified" (or "draft") from here
  if (isProfileComplete && bankStatus === "unverified") return "bankDetails";
  return "completeAccount";
}

export function AccountReviewBanner({ status, bankStatus, isProfileComplete, onDismiss }: AccountReviewBannerProps) {
  const bannerKind = getBannerKind(status, bankStatus, isProfileComplete);
  const navigate = useNavigate();

  if (!bannerKind) return null;

  const config = STATUS_CONFIG[bannerKind];
  const isWarning = bannerKind === "completeAccount" || bannerKind === "bankDetails";
  const icon =
    bannerKind === "completeAccount" ? completeAccount : bannerKind === "bankDetails" ? bank : clock;

  return (
    <div className={`flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center justify-between gap-4  dark:bg-[#0F6E56]/15 border  dark:border-emerald-800/40 rounded-lg p-4 ${isWarning ? 'bg-[#FCEBC9] border-[#FCEBC9]' : "bg-[#E4F1EB] border-emerald-200"}`}>
      <div className="flex items-start sm:items-center gap-3">
        <div className="bg-card p-4 rounded-md shrink-0">
          <img src={icon} alt="Clock icon" className="size-6 text-[#04241c]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[18px] font-grotesk font-medium text-[#7A4E02] dark:text-[#F5C875]">
              {config.title}
            </p>
            <Badge className={`bg-white dark:bg-[#0F6E56]/25 hover:bg-amber-100 dark:hover:bg-[#0F6E56]/35 text-[13px] font-space p-3 rounded-[8px] ${isWarning ? "text-[#7A4E02]" : "text-[#0F6E56] dark:text-[#4ADE80]"}`}>
              {config.badge}
            </Badge>
          </div>
          <p className="text-[14px] text-[#4A4451] dark:text-white/70 mt-2">
            {config.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full min-[480px]:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(config.actionTo)}
          className="text-[14px] py-4 bg-[#1A1523] text-[#FFFFFF] flex-1 min-[480px]:flex-none"
        >
          {config.actionLabel}
        </Button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 shrink-0"
            aria-label="Dismiss"
          >
            <X className="size-5 text-[#7A4E02] dark:text-[#F5C875]" />
          </button>
        )}
      </div>
    </div>
  );
}