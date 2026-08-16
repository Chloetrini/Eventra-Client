import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostponeEventDialogProps {
  event: { id: string; title: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (eventId: string, newStartDate: string, reason?: string) => void;
  isSubmitting?: boolean;
}

// Today at local midnight, as a yyyy-mm-dd string — the date input's min.
function todayValue(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function PostponeEventDialog({ event, open, onOpenChange, onConfirm, isSubmitting }: PostponeEventDialogProps) {
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");

  if (!event) return null;

  const isDateValid = Boolean(newDate);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setNewDate("");
      setReason("");
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!isDateValid) return;
    onConfirm(event.id, new Date(newDate).toISOString(), reason.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Postpone event</DialogTitle>
          <DialogDescription>
            Move <strong>{event.title}</strong> to a new date. Existing tickets stay valid — every
            attendee holding one will be emailed the new date automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="postpone-date">New date</Label>
            <Input
              id="postpone-date"
              type="date"
              min={todayValue()}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="postpone-reason">Reason (optional)</Label>
            <Textarea
              id="postpone-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let attendees know why the event is being postponed…"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Never mind
          </Button>
          <Button onClick={handleConfirm} disabled={!isDateValid || isSubmitting} className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-white">
            {isSubmitting ? "Postponing…" : "Postpone event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
