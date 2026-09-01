import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/lib/notifications-api";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationsKeys.all, "list"] as const,
  unreadCount: () => [...notificationsKeys.all, "unread-count"] as const,
};

// Polls every 30s — cheap enough (one count query) that a logged-in admin
// or organizer sees a new notification without needing to reload the tab.
const UNREAD_COUNT_POLL_MS = 30_000;

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: fetchUnreadNotificationCount,
    refetchInterval: UNREAD_COUNT_POLL_MS,
  });
}

// Only fetched once the bell dropdown is actually opened (see `enabled`) —
// no reason to pull the last 10 notifications on every page load when most
// visits never open the bell.
export function useNotificationsList(enabled: boolean) {
  return useQuery({
    queryKey: notificationsKeys.list(),
    queryFn: () => fetchNotifications(10),
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}