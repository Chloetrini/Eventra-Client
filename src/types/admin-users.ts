// Mirrors what admin.controller.ts's listUsers/getUserDetail actually
// return (see body.users in listUsers, and the flattened `{...user,
// ordersCount, totalSpent, orderHistory}` shape in getUserDetail) — kept
// separate from the attendee/organizer types since this is the admin's
// view of a platform account, not an event-scoped attendee.

export interface AdminUserListItem {
  _id: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
  role: "attendee" | "organizer" | "admin";
  isSuspended: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface AdminUserOrderHistoryEntry {
  orderId: string;
  eventTitle: string;
  amount: number;
  date: string;
}

export interface AdminUserDetail {
  _id: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
  role: "attendee" | "organizer" | "admin";
  isSuspended: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  orderHistory: AdminUserOrderHistoryEntry[];
  // The viewer admin's own currency — totalSpent/orderHistory[].amount are
  // both already converted into it server-side (same display-only pattern
  // as every other admin money page). Optional since older cached
  // responses/tests may not carry it; format helpers default to Naira.
  currency?: string;
}

export interface AdminUsersListMeta {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export type AdminUserStatusFilter = "all" | "active" | "suspended";
