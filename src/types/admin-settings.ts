// Powers the Settings > "Admin, Teams & Roles" card. Mirrors the AdminTier
// type on the backend (middlewares/adminPermission.middleware.ts).
export type AdminTier = "owner" | "admin" | "support";

export interface AdminMember {
  id: string
  name: string
  email: string
  role: AdminTier
}