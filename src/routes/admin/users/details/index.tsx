import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SuspendUserDialog } from "@/components/dialogs/suspend-user-dialog";
import {
  useAdminUserDetail,
  useSuspendAdminUser,
  useUnsuspendAdminUser,
} from "@/hooks/use-admin-users";
import { formatDateTime, formatNaira } from "@/lib/utils";
import PageWrapper from "@/components/page-wrapper";

// Same "border + p-4/p-5" stat-card shell used everywhere else in the app
// (organizer dashboard's EventMetricsGrid StatCard, admin overview's
// StatCard) — kept local rather than importing either of those since both
// are typed to their own domain's card-data shape.
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs  max-w-[280px] w-full h-[145px] space-y-6">
      <p className="text-sm md:text-[16px] font-space font-normal text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-bold font-space tracking-tighter text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [confirmingSuspend, setConfirmingSuspend] = useState(false);

  const { data: user, isLoading, isError } = useAdminUserDetail(id);
  const suspendMutation = useSuspendAdminUser();
  const unsuspendMutation = useUnsuspendAdminUser();

  const handleSuspendConfirmed = async (userId: string) => {
    try {
      await suspendMutation.mutateAsync(userId);
      toast.success("Account suspended");
      setConfirmingSuspend(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not suspend this account. Please try again.");
    }
  };

  const handleUnsuspend = async () => {
    if (!user) return;
    try {
      await unsuspendMutation.mutateAsync(user._id);
      toast.success("Account unsuspended");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unsuspend this account. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">User not found</h2>
        <p className="text-sm text-muted-foreground">
          The requested account could not be retrieved.
        </p>
      </div>
    );
  }

  const lastOrder = user.orderHistory[0];

  return (
    <PageWrapper className="p-[20px] space-y-6">
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to users
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            name={user.fullname}
            className="w-[64px] h-[64px] text-[22px] font-bold"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[26px] leading-[32px] font-grotesk font-semibold text-foreground">
                {user.fullname}
              </h1>
              <Badge
                className={
                  user.isSuspended
                    ? "bg-destructive/10 dark:bg-destructive/20 text-destructive hover:bg-destructive/10 rounded-[15px] h-[28px] px-3 font-semibold text-[12px]"
                    : "bg-[#E4F1EB] dark:bg-[#0F6E56]/15 text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 rounded-[15px] h-[28px] px-3 font-semibold text-[12px]"
                }
              >
                {user.isSuspended ? "SUSPENDED" : "ACTIVE"}
              </Badge>
            </div>
            <p className="text-[15px] text-muted-foreground mt-1">
              {user.email} · Joined {formatDateTime(user.createdAt, "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 max-w-[900px]">
        <StatCard label="Total orders" value={String(user.ordersCount)} />
        <StatCard label="Total spent" value={formatNaira(user.totalSpent, user.currency)} />
        <StatCard
          label="Status"
          value={user.isSuspended ? "SUSPENDED" : "ACTIVE"}
        />
      </div>

      <div>
        <h2 className="text-[18px] font-grotesk font-semibold text-foreground mb-3">
          Order history
        </h2>
        {user.orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-lg">
            <p className="text-base text-[18px] font-bold text-foreground">No orders yet</p>
            <p className="font-medium text-muted-foreground mt-1">
              This account hasn't purchased any tickets.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto max-w-full">
            <table className="w-full max-w-full text-sm">
              <thead>
                <tr className="border-b border-border font-space">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
                    EVENT
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
                    AMOUNT
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.orderHistory.map((order) => (
                  <tr key={order.orderId} className="border-border last:border-b-0">
                    <td className="py-4 px-4 text-foreground font-semibold text-[16px]">
                      {order.eventTitle}
                    </td>
                   
                    <td className="px-4 text-foreground text-[16px]">
                      {formatNaira(order.amount, user.currency)}
                    </td>
                     <td className="px-4 text-foreground text-[16px]">
                      {formatDateTime(order.date, "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <p className="text-[15px] font-medium text-foreground">
          {user.isSuspended
            ? "This account is currently suspended."
            : "Account in good standing."}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<a href={`mailto:${user.email}`} />}>
            <Mail className="size-4" />
            Message
          </Button>
          {user.isSuspended ? (
            <Button
              variant="outline"
              onClick={handleUnsuspend}
              disabled={unsuspendMutation.isPending}
            >
              {unsuspendMutation.isPending ? "Unsuspending…" : "Unsuspend"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setConfirmingSuspend(true)}>
              Suspend
            </Button>
          )}
        </div>
      </div>

      <SuspendUserDialog
        user={confirmingSuspend ? { id: user._id, name: user.fullname } : null}
        open={confirmingSuspend}
        onOpenChange={setConfirmingSuspend}
        onConfirm={handleSuspendConfirmed}
        isPending={suspendMutation.isPending}
      />
    </PageWrapper>
  );
}
