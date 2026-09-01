import { useState } from "react";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsList,
  useUnreadNotificationCount,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/hooks/use-notifications";
import type { NotificationItem } from "@/types/notifications";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  // Each topbar styles its icon buttons slightly differently (admin uses
  // the shared `Button` component's "outline" look, organizer uses its own
  // plain `bg-muted border` button) — this lets each host match its own
  // sibling buttons instead of the dropdown looking bolted-on.
  triggerClassName?: string;
}

// Shared between the admin console's topbar and the organizer dashboard's
// topbar — both hit the exact same GET /api/v1/notifications endpoints,
// scoped by session, so one component does both jobs. Previously each
// topbar had its own static bell button with a permanently-on red dot;
// this replaces both with something backed by real data.
export function NotificationBell({ triggerClassName }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  const { data: unread } = useUnreadNotificationCount();
  const { data: list, isLoading } = useNotificationsList(open);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  const unreadCount = unread?.total ?? 0;

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }
    setOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "relative text-muted-foreground hover:text-foreground transition-colors bg-muted border border-border p-2 rounded-lg shrink-0",
          triggerClassName,
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-card" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] max-w-[calc(100vw-2rem)] rounded-[16px] border border-border p-0 shadow-lg bg-card mt-2"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-[15px] font-bold text-foreground">
            Notifications
          </span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1 text-xs font-medium text-[#0F6E56] dark:text-[#4ADE80] hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
            {list && list.notifications.length > 0 && (
              <button
                onClick={() => setConfirmingDeleteAll(true)}
                className="flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete all
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : !list || list.notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            list.notifications.map((notification) => (
              <div
                key={notification._id}
                className={cn(
                  "w-full flex gap-2.5 px-4 py-3 border-b border-border last:border-b-0 transition-colors hover:bg-muted/60",
                  !notification.isRead && "bg-[#0F6E56]/5 dark:bg-[#0F6E56]/10",
                )}
              >
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className="flex gap-2.5 flex-1 min-w-0 text-left"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0",
                      notification.isRead
                        ? "bg-transparent"
                        : "bg-[#0F6E56] dark:bg-[#4ADE80]",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-foreground truncate">
                      {notification.title}
                    </span>
                    <span className="block text-[13px] text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </span>
                    <span className="block text-[11px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </span>
                </button>
                <button
                  onClick={(e) => handleDelete(e, notification._id)}
                  disabled={deleteMutation.isPending}
                  aria-label="Delete notification"
                  className="shrink-0 self-start p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
      <Dialog open={confirmingDeleteAll} onOpenChange={setConfirmingDeleteAll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all notifications?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently removes every notification in your list. This can't
            be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmingDeleteAll(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteAllMutation.isPending}
              onClick={() => {
                deleteAllMutation.mutate();
                setConfirmingDeleteAll(false);
              }}
            >
              {deleteAllMutation.isPending ? "Deleting…" : "Delete all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
