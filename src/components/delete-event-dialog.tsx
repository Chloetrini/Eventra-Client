import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

interface DeleteEventDialogProps {
    event: Event | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (eventId: string) => void;
}

export function DeleteEventDialog ({
     event, open, onOpenChange, onConfirm
}: DeleteEventDialogProps) {
    if (!event) return null;

    const handleConfirm = () => {
        onConfirm (event._id);
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
                        Are you sure you want to delete <strong>{event.eventTitle}</strong>? This action cannot be undone.
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