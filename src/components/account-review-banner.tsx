import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clock from "@/assets/Vector.png"
import { useNavigate } from "react-router";

type OrganizerAccountStatus = "unverified" | "pending" | "verified" | "rejected";

interface AccountReviewBannerProps {
  status: OrganizerAccountStatus;
  onDismiss?: () => void;
}

type BannerConfig = {
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

const STATUS_CONFIG: Record<Exclude<OrganizerAccountStatus, "verified">, BannerConfig> = {
  unverified: {
    title: "Finish setting up your account",
    badge: "UNVERIFIED",
    description:
      "Add your bank details to publish paid events and receive payouts. Free events can go live without it.",
    actionLabel: "Finish onboarding",
    actionTo: "/onboarding/organisation",
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

export function AccountReviewBanner({ status, onDismiss }: AccountReviewBannerProps) {
  if (status === "verified") return null;

  const config = STATUS_CONFIG[status];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center justify-between gap-4 bg-[#E4F1EB] border border-emerald-200 rounded-lg p-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="bg-white p-4 rounded-md shrink-0">
          <img src={clock} alt="Clock icon" className="size-5 text-[#04241c]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[18px] font-grotesk font-medium text-[#7A4E02]">
              {config.title}
            </p>
            <Badge className="bg-[#FFFFFF] text-[#0F6E56] hover:bg-amber-100 text-[13px] font-space">
              {config.badge}
            </Badge>
          </div>
          <p className="text-[14px] text-[#4A4451] mt-2">
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
            className="text-emerald-700 hover:text-emerald-900 shrink-0"
            aria-label="Dismiss"
          >
            <X className="size-5 text-[#7A4E02]" />
          </button>
        )}
      </div>
    </div>
  );
}