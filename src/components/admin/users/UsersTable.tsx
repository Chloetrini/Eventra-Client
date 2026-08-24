import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDateTime, formatNaira } from "@/lib/utils";
import type { AdminUserListItem } from "@/types/admin-users";

interface UsersTableProps {
  users: AdminUserListItem[];
}

// Same table anatomy as AttendeeList (organizer dashboard's Attendees
// page) — border/rounded shell, font-space uppercase header row, avatar +
// name/email stacked cell, status pill on the right — so the admin
// console's Users table reads as the same product rather than a
// differently-styled screen bolted on.
export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-lg">
        <p className="text-base text-[20px] font-bold text-foreground">No users found</p>
        <p className="font-medium text-muted-foreground mt-1">
          Nothing matches this search or filter yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border font-space">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              USER
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              EMAIL
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              ORDERS
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              SPENT
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              JOINED
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              STATUS
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onClick={() => navigate(`/admin/users/${user._id}`)}
              className="border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <td className="py-5 px-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    avatarUrl={user.avatarUrl}
                    name={user.fullname}
                    className="w-[50px] h-[50px] text-[18px] font-bold"
                  />
                  <p className="text-foreground font-semibold text-[17px]">{user.fullname}</p>
                </div>
              </td>
              <td className="px-4 text-[16px] font-medium text-muted-foreground">{user.email}</td>
              <td className="px-4 text-foreground text-[16px]">{user.ordersCount}</td>
              <td className="px-4 text-foreground text-[16px]">{formatNaira(user.totalSpent)}</td>
              <td className="px-4 text-foreground text-[16px]">
                {formatDateTime(user.createdAt, "MMM d, yyyy")}
              </td>
              <td className="px-4">
                <Badge
                  className={
                    user.isSuspended
                      ? "bg-destructive/10 dark:bg-destructive/20 text-destructive hover:bg-destructive/10 rounded-[15px] w-[110px] h-[36px] font-semibold text-[13px]"
                      : "bg-[#E4F1EB] dark:bg-[#0F6E56]/15 text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 rounded-[15px] w-[110px] h-[36px] font-semibold text-[13px]"
                  }
                >
                  {user.isSuspended ? "SUSPENDED" : "ACTIVE"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
