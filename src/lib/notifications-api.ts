import { api } from "@/lib/api";
import type {
  NotificationItem,
  NotificationsListMeta,
  UnreadNotificationCount,
} from "@/types/notifications";

export interface FetchNotificationsResult {
  notifications: NotificationItem[];
  meta: NotificationsListMeta;
}

// GET /api/v1/notifications — scoped to whoever's logged in via session, so
// this same call works for an admin or an organizer without any role param.
// Used for the bell dropdown's recent-notifications list.
export async function fetchNotifications(limit = 10): Promise<FetchNotificationsResult> {
  const res = (await api.get(`/notifications?limit=${limit}`)) as {
    body?: FetchNotificationsResult;
  };
  return res.body ?? { notifications: [], meta: { currentPage: 1, limit, total: 0, totalPages: 1, hasMore: false } };
}

// GET /api/v1/notifications/unread-count — powers the bell's red dot.
export async function fetchUnreadNotificationCount(): Promise<UnreadNotificationCount> {
  const res = (await api.get("/notifications/unread-count")) as { body?: UnreadNotificationCount };
  return res.body ?? { total: 0, byType: {} };
}

// PATCH /api/v1/notifications/:id/read
export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`, {});
}

// PATCH /api/v1/notifications/read-all
export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/notifications/read-all", {});
}
