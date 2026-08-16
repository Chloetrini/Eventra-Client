import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CancelEventDialogProps {
  event: { id: string; title: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (eventId: string, reason: string) => void;
  isSubmitting?: boolean;
}

// Matches the backend's cancelEventSchema — reason is required, min 3 chars.
const MIN_REASON_LENGTH = 3;

export function CancelEventDialog({ event, open, onOpenChange, onConfirm, isSubmitting }: CancelEventDialogProps) {
  const [reason, setReason] = useState("");

  if (!event) return null;

  const isReasonValid = reason.trim().length >= MIN_REASON_LENGTH;

  const handleOpenChange = (next: boolean) => {
    if (!next) setReason("");
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!isReasonValid) return;
    onConfirm(event.id, reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Cancel event</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel <strong>{event.title}</strong>? Every attendee holding a
            valid ticket will be emailed immediately, and paid tickets will be automatically refunded.
            This can't be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="cancel-reason">Reason for cancelling</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let attendees know why the event is being cancelled…"
            rows={3}
          />
          {!isReasonValid && reason.length > 0 && (
            <p className="text-xs text-destructive">Reason must be at least {MIN_REASON_LENGTH} characters.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Never mind
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isReasonValid || isSubmitting}>
            {isSubmitting ? "Cancelling…" : "Cancel event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
