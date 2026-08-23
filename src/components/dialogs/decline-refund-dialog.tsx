import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DeclineRefundDialogProps {
  request: { id: string; attendeeName: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (requestId: string, reason: string) => void;
  isSubmitting?: boolean;
}

// Unlike CancelEventDialog's reason, the backend's rejectRefundRequest
// doesn't require one — the reason field is optional here to match.
export function DeclineRefundDialog({ request, open, onOpenChange, onConfirm, isSubmitting }: DeclineRefundDialogProps) {
  const [reason, setReason] = useState("");

  if (!request) return null;

  const handleOpenChange = (next: boolean) => {
    if (!next) setReason("");
    onOpenChange(next);
  };

  const handleConfirm = () => {
    onConfirm(request.id, reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Decline refund request</DialogTitle>
          <DialogDescription>
            Are you sure you want to decline <strong>{request.attendeeName}</strong>'s refund request?
            They'll be notified this was declined. This can't be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="decline-reason">Reason (optional)</Label>
          <Textarea
            id="decline-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let the attendee know why, if you'd like…"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Never mind
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Declining…" : "Decline request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
