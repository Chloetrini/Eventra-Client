import { useNavigate } from "react-router";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDateTime, formatCompactNaira } from "@/lib/utils";
import type { AdminUserListItem } from "@/types/admin-users";

interface UsersTableProps {
  users: AdminUserListItem[];
  currency?: string;
}

export function UserStatusBadge({
  isDeleted,
  isSuspended,
}: {
  isDeleted?: boolean;
  isSuspended?: boolean;
}) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        DELETED
      </span>
    );
  }

  if (isSuspended) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3.5 py-1 text-[11px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wide">
        SUSPENDED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/25 px-3 py-1 text-[11px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wide">
      ACTIVE
    </span>
  );
}

export function UsersTable({ users, currency }: UsersTableProps) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No users match your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50 text-[16px] font-space font-[400] uppercase tracking-wider text-muted-foreground md:text-[16px]">
              <th className="px-3 py-4 md:px-6">USER</th>
              <th className="px-3 py-4 md:px-6 max-w-[180px]">EMAIL</th>
              <th className="px-3 py-4 text-center md:px-6">ORDERS</th>
              <th className="px-3 py-4 md:px-6">SPENT</th>
              <th className="px-3 py-4 md:px-6">JOINED</th>
              <th className="px-3 py-4 md:px-6">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigate(`/admin/users/${user._id}`)}
                className="group cursor-pointer transition-colors hover:bg-accent/50"
              >
                <td className="px-3 py-4 align-middle md:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      name={user.fullname}
                      className="h-10 w-10 shrink-0 bg-black text-[15px] font-bold text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[15px] font-[600] text-foreground transition-colors group-hover:text-primary max-sm:truncate sm:break-words md:text-[17px]">
                        {user.fullname}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-4 align-middle md:px-6">
                  <div className="font-[400] max-w-[180px] truncate whitespace-nowrap font-geist text-[14px] text-muted-foreground max-sm:max-w-[180px] max-sm:truncate sm:break-words md:text-[16px] lg:max-w-[320px]">
                    {user.email}
                  </div>
                </td>

                <td className="px-3 py-4 text-center align-middle text-[16px] font-[700] font-space text-foreground md:px-6 md:text-[20px]">
                  {user.ordersCount}
                </td>

                <td className="px-3 py-4 align-middle font-geist text-[14px] font-[400] text-foreground md:px-6 md:text-[16px]">
                  <span className="block max-sm:truncate sm:break-words">
                    {user.totalSpent
                      ? formatCompactNaira(user.totalSpent, currency)
                      : "—"}
                  </span>
                </td>

                <td className="px-3 py-4 align-middle font-[400] text-muted-foreground md:px-6 text-[14px] md:text-[16px] font-geist">
                  <span className="block max-sm:truncate sm:break-words">
                    {formatDateTime(user.createdAt, "MMM yyyy")}
                  </span>
                </td>

                <td className="px-3 py-4 align-middle md:px-6">
                  <div className="flex justify-start">
                    <UserStatusBadge
                      isDeleted={user.isDeleted}
                      isSuspended={user.isSuspended}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}