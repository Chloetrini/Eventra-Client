import { useState } from "react";
import { Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AccountReviewBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center justify-between gap-4 bg-[#E4F1EB] border border-emerald-200 rounded-lg p-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="bg-white p-2 shrink-0">
          <Clock className="size-4 text-[#04241c]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-[#7A4E02]">
              Your account is under review
            </p>
            <Badge className="bg-[#FFFFFF] text-[#0F6E56] hover:bg-amber-100 text-[10px]">
              PENDING
            </Badge>
          </div>
          <p className="text-xs text-[#4A4451] mt-1">
            We usually approve within a day. Free events can go live now, paid
            events unlock once you’re verified.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full min-[480px]:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-[#1A1523] text-[#FFFFFF] flex-1 min-[480px]:flex-none"
        >
          View Status
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-emerald-700 hover:text-emerald-900 shrink-0"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}