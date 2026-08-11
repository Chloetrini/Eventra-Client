import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Ticket, Lock } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onContinueAsGuest: () => void;
  allowGuest: boolean;
};

export function AuthGateModal({
  open,
  onClose,
  onSignIn,
  onContinueAsGuest,
  allowGuest,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-full max-w-[602px] max-h-[559px] sm:h-[559px] rounded-[16px] sm:rounded-[25px] overflow-y-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-2xl bg-[#E4F1EB] flex items-center justify-center">
            <Ticket className="h-10 w-10 text-[#F5A524]" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-[26px] font-extrabold text-[#1A1523] text-center mb-3 font-grotesk">
          Sign in for full experience
        </h2>
        <p className="text-[#4A4451] text-center leading-6 mb-8 font-geist">
          {allowGuest
            ? "Keep every ticket and saved event in one place, and check out faster next time. Prefer not to? You can continue as a guest — we'll email your tickets."
            : "You need an account to do that. Sign in to save events, view your tickets, and manage your saved list."}
        </p>
        <button
          onClick={onSignIn}
          className="w-full h-14 rounded-xl bg-[#0A4F41] hover:bg-[#0F6E56] text-white font-bold text-[18px] font-grotesk mb-4"
        >
          Sign in or create account
        </button>
        {allowGuest && (
          <>
            <button
              onClick={onContinueAsGuest}
              className="w-full h-14 rounded-xl border border-[#E8E6E0] hover:bg-[#F6F5F1] text-[#1A1523] font-bold text-[18px] font-grotesk mb-3"
            >
              Continue as guest
            </button>
            <p className="flex items-center justify-center gap-2 text-[13px] text-[#4A4451] font-geist">
              <Lock className="h-4 w-4 text-[#F5A524]" />
              Guest tickets are sent to your email
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}