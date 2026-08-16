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
      <DialogContent className="w-full max-w-[602px] max-h-[80vh] rounded-[16px] sm:rounded-[25px] overflow-y-auto p-6">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-[#E4F1EB] dark:bg-[#0F6E56]/15 flex items-center justify-center">
            <Ticket className="h-8 w-8 text-[#F5A524]" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-[22px] font-extrabold text-foreground text-center mb-2 font-grotesk">
          Sign in for full experience
        </h2>
        <p className="text-muted-foreground text-center leading-6 mb-6 font-geist">
          {allowGuest
            ? "Keep every ticket and saved event in one place, and check out faster next time. Prefer not to? You can continue as a guest — we'll email your tickets."
            : "You need an account to do that. Sign in to save events, view your tickets, and manage your saved list."}
        </p>
        <button
          onClick={onSignIn}
          className="w-full h-12 rounded-xl bg-[#0A4F41] hover:bg-[#0F6E56] text-white font-bold text-[16px] font-grotesk mb-3"
        >
          Sign in or create account
        </button>
        {allowGuest && (
          <>
            <button
              onClick={onContinueAsGuest}
              className="w-full h-12 rounded-xl border border-border hover:bg-accent text-foreground font-bold text-[16px] font-grotesk mb-3"
            >
              Continue as guest
            </button>
            <p className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground font-geist">
              <Lock className="h-4 w-4 text-[#F5A524]" />
              Guest tickets are sent to your email
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}