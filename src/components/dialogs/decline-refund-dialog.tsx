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
// doesn't require one (no minimum length, no `required: true` on the
// schema) — so this stays optional. Still worth asking for: it's stored on
// the request and is the only record of why an admin said no.
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
            No money moves, and this can't be undone from here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="decline-reason">Reason (optional)</Label>
          <Textarea
            id="decline-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let the attendee know why this wasn't approved…"
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
