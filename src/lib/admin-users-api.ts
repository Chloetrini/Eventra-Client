import { api } from "@/lib/api";
import type {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserStatusFilter,
  AdminUsersListMeta,
} from "@/types/admin-users";

export interface FetchAdminUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: AdminUserStatusFilter;
}

export interface FetchAdminUsersResult {
  users: AdminUserListItem[];
  meta: AdminUsersListMeta;
  // The viewer admin's own currency — every user's totalSpent in `users`
  // is already converted into it server-side, same pattern as every other
  // admin money page.
  currency?: string;
}

// GET /api/v1/admin/users — see listUsers in admin.controller.ts. `status`
// is only sent when it's not "all": the backend's filter branch only
// checks for 'active'/'suspended' and otherwise leaves isSuspended
// unfiltered, so omitting it for "all" is equivalent and one less param
// to think about.
export async function fetchAdminUsers(
  params: FetchAdminUsersParams = {}
): Promise<FetchAdminUsersResult> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.status && params.status !== "all") search.set("status", params.status);

  const query = search.toString();
  const res = (await api.get(`/admin/users${query ? `?${query}` : ""}`)) as {
    body?: FetchAdminUsersResult;
  };
  return res.body ?? { users: [], meta: { currentPage: 1, limit: 20, total: 0, totalPages: 1, hasMore: false } };
}

// GET /api/v1/admin/users/:id — see getUserDetail in admin.controller.ts.
export async function fetchAdminUserDetail(id: string): Promise<AdminUserDetail> {
  const res = (await api.get(`/admin/users/${id}`)) as { body?: AdminUserDetail };
  if (!res.body) throw new Error("User not found");
  return res.body;
}

// PATCH /api/v1/admin/users/:id/suspend — see suspendUser in admin.controller.ts.
export async function suspendAdminUser(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/suspend`, {});
}

// PATCH /api/v1/admin/users/:id/unsuspend — see unsuspendUser in admin.controller.ts.
export async function unsuspendAdminUser(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/unsuspend`, {});
}

// PATCH /api/v1/admin/users/:id/delete — see deleteUser in admin.controller.ts.
// A soft delete: blocks login and signs the account out, but keeps the
// row (and past orders/records referencing it) intact.
export async function deleteAdminUser(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/delete`, {});
}

// PATCH /api/v1/admin/users/:id/restore — see restoreUser in admin.controller.ts.
export async function restoreAdminUser(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/restore`, {});
}
