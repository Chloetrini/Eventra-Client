
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Deliberately a minimal { id, title } shape rather than the full Event
// type — this dialog is shared by every place an event row can be
// deleted from (Events list, Overview's Recent events, the single-event
// details page), and those don't all have the same event shape on hand.
interface DeleteEventDialogProps {
    event: { id: string; title: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (eventId: string) => void;
}

export function DeleteEventDialog ({
     event, open, onOpenChange, onConfirm
}: DeleteEventDialogProps) {
    if (!event) return null;

    const handleConfirm = () => {
        onConfirm (event.id);
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className=" text-[20px] font-bold">
                        Delete event
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                       Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}