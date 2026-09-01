import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Same minimal { id, name } shape as SuspendUserDialog/DeleteEventDialog —
// kept deliberately small so this can be reused from both the Users list
// row action and the user detail page's "Delete" button without either
// caller having to hand over the full AdminUserListItem/AdminUserDetail
// shape.
interface DeleteUserDialogProps {
  user: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isPending?: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteUserDialogProps) {
  if (!user) return null;

  const handleConfirm = () => {
    onConfirm(user.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">Delete account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{user.name}</strong>'s account? They'll be
            signed out immediately and won't be able to log back in. Their past orders, events,
            and refunds stay on record — you can restore this account at any time from the same
            page.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
