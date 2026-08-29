import { api } from "@/lib/api"
import type { AdminMember, AdminTier } from "@/types/admin-settings"

interface RawAdmin {
  _id: string
  fullname: string
  email: string
  adminRole?: AdminTier
}

// requireAdminTier() on the backend defaults a missing adminRole to
// "owner" for pre-existing admins — mirror that here so the Settings
// table never shows a blank role for an admin created before adminRole
// existed on the schema.
function mapAdmin(raw: RawAdmin): AdminMember {
  return {
    id: raw._id,
    name: raw.fullname,
    email: raw.email,
    role: raw.adminRole ?? "owner",
  }
}

export async function fetchAdmins(): Promise<AdminMember[]> {
  const res = await api.get("/admin/settings/admins")
  const body = res.body as { admins: RawAdmin[] }
  return body.admins.map(mapAdmin)
}

export async function inviteAdminAccount(input: { fullname: string; email: string; adminRole: AdminTier }) {
  // Matches admin.routes.ts's actual route — POST /admin/settings/admins/invite,
  // not /admin/settings/admins (that path is GET-only, for listing).
  const res = await api.post("/admin/settings/admins/invite", input)
  const body = res.body as RawAdmin
  return mapAdmin(body)
}

export async function updateAdminMemberRole(id: string, adminRole: AdminTier) {
  // Matches admin.routes.ts's actual route — PATCH /admin/settings/admins/:id/role.
  const res = await api.patch(`/admin/settings/admins/${id}/role`, { adminRole })
  const body = res.body as RawAdmin
  return mapAdmin(body)
}

// Owner-tier only on the backend (deleteAdmin, admin.controller.ts) — an
// owner account, and the caller's own account, both reject with a 400
// there rather than silently no-op-ing.
export async function deleteAdminAccount(id: string) {
  await api.delete(`/admin/settings/admins/${id}`)
}
