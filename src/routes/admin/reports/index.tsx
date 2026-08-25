import { useState } from "react";
import { useFlags, useAuditLog, useDismissFlag, useActionFlag } from "@/hooks/use-reports";
import FlagsTable from "@/components/admin/reports/FlagsTable";
import AuditLogTable from "@/components/admin/reports/AuditLogTable";
import { cn } from "@/lib/utils";
import type { Flag } from "@/types/report";
import PageWrapper from "@/components/page-wrapper";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"flags" | "audit">("flags");
  const { data: flags, isLoading: flagsLoading } = useFlags();
  const { data: auditLog, isLoading: auditLoading } = useAuditLog();
  const dismissFlag = useDismissFlag();
  const actionFlag = useActionFlag();

  const handleDismiss = (flag: Flag) => {
    dismissFlag.mutate({ targetType: flag.targetType, targetId: flag.targetId });
  };

  const handleSuspend = (flag: Flag) => {
    // Destructive — removes the event site-wide or suspends the
    // organizer's account, so confirm before firing it.
    const confirmMessage =
      flag.targetType === "event"
        ? `Remove "${flag.title}"? It will come down site-wide immediately.`
        : `Suspend the organizer behind "${flag.title}"? They'll be logged out and blocked from the platform.`;
    if (!window.confirm(confirmMessage)) return;
    actionFlag.mutate({ targetType: flag.targetType, targetId: flag.targetId });
  };

  return (
    <PageWrapper className="flex flex-col gap-6 min-w-0 p-[20px]">
      <div>
        <p className="text-[13px] min-[400px]:text-xs font-medium font-space tracking-wide pt-3 uppercase text-[#0F6E56] dark:text-[#4ADE80]">
          Needs action
        </p>
        <h1 className="text-[28px] font-grotesk min-[400px] font-bold text-foreground">
          Reports
        </h1>
        <p className="text-[16px] font-medium min-[400px] text-muted-foreground">
          Flagged events and organizers, plus the full platform audit log
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveTab("flags")}
          className={cn(
            "px-5 py-3 rounded-md text-[16px] font-semibold flex items-center gap-10 shrink-0",
            activeTab === "flags"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground"
          )}
        >
          Flags
          <span className="bg-muted-foreground font-space text-background rounded-[12.28px] px-[6px] py-[2px] text-xs">
            {flags?.length ?? 0}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={cn(
            "px-8 py-3 rounded-md text-[16px] font-semibold shrink-0",
            activeTab === "audit"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground"
          )}
        >
          Audit log
        </button>
      </div>

      {activeTab === "flags" ? (
        <FlagsTable
          flags={flags}
          isLoading={flagsLoading}
          onDismiss={handleDismiss}
          onSuspend={handleSuspend}
        />
      ) : (
        <AuditLogTable entries={auditLog} isLoading={auditLoading} />
      )}
    </PageWrapper>
  );
}
