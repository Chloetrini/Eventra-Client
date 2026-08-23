// Mirrors the backend's Notification model (src/models/notification.ts) and
// the shapes listNotifications/getUnreadNotificationCount actually return.
export type NotificationType =
  | "new_sale"
  | "event_approved"
  | "event_rejected"
  | "promotion_approved"
  | "promotion_rejected"
  | "organizer_approved"
  | "organizer_rejected"
  | "organizer_pending_review"
  | "event_pending_review"
  | "refund_requested"
  | "promotion_requested";

export interface NotificationItem {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  relatedEvent?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListMeta {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UnreadNotificationCount {
  total: number;
  byType: Partial<Record<NotificationType, number>>;
}
