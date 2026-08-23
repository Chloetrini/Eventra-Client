import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Same minimal { id, name } shape as DeleteEventDialog — kept deliberately
// small so this can be reused from both the Users list row action and the
// user detail page's "Suspend" button without either caller having to hand
// over the full AdminUserListItem/AdminUserDetail shape.
interface SuspendUserDialogProps {
  user: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isPending?: boolean;
}

export function SuspendUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: SuspendUserDialogProps) {
  if (!user) return null;

  const handleConfirm = () => {
    onConfirm(user.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Suspend account</DialogTitle>
          <DialogDescription>
            Are you sure you want to suspend <strong>{user.name}</strong>? They'll be signed out
            immediately and won't be able to log back in until you unsuspend them.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Suspending…" : "Suspend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
