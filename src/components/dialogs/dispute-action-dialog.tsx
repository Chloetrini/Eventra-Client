import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type DisputeActionMode = "challenge" | "accept-loss";

interface DisputeActionDialogProps {
  dispute: { id: string; attendeeName: string; amount: number } | null;
  mode: DisputeActionMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // message is only meaningful for "challenge" — accept-loss ignores it.
  onConfirm: (disputeId: string, message: string) => void;
  isSubmitting?: boolean;
}

// A "challenge" needs the admin's explanation of why the charge was
// legitimate — that text doubles as the evidence Paystack asks for
// ("service_details"), so it's required. "Accept loss" needs no message,
// it's a direct concession.
const MIN_MESSAGE_LENGTH = 10;

export function DisputeActionDialog({
  dispute,
  mode,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DisputeActionDialogProps) {
  const [message, setMessage] = useState("");

  if (!dispute) return null;

  const isChallenge = mode === "challenge";
  const isMessageValid = !isChallenge || message.trim().length >= MIN_MESSAGE_LENGTH;

  const handleOpenChange = (next: boolean) => {
    if (!next) setMessage("");
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!isMessageValid) return;
    onConfirm(dispute.id, message.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">
            {isChallenge ? "Challenge dispute" : "Accept loss"}
          </DialogTitle>
          <DialogDescription>
            {isChallenge ? (
              <>
                This submits your evidence to Paystack and tells them you're contesting{" "}
                <strong>{dispute.attendeeName}</strong>'s ₦{dispute.amount.toLocaleString()} chargeback.
                Paystack (and the customer's bank) will review it — this doesn't close the dispute
                immediately.
              </>
            ) : (
              <>
                This tells Paystack you're not contesting <strong>{dispute.attendeeName}</strong>'s ₦
                {dispute.amount.toLocaleString()} chargeback — the money stays with the customer and the
                dispute closes. This can't be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isChallenge && (
          <div className="space-y-1.5">
            <Label htmlFor="dispute-message">Why was this charge legitimate?</Label>
            <Textarea
              id="dispute-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. the attendee's ticket was scanned and used at the event on…"
              rows={4}
            />
            {!isMessageValid && message.length > 0 && (
              <p className="text-xs text-destructive">Please explain in at least {MIN_MESSAGE_LENGTH} characters.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Never mind
          </Button>
          <Button
            variant={isChallenge ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={!isMessageValid || isSubmitting}
          >
            {isSubmitting
              ? isChallenge
                ? "Submitting…"
                : "Accepting…"
              : isChallenge
                ? "Submit challenge"
                : "Accept loss"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
