import { useState } from "react";
import { useFlags, useAuditLog, useDismissFlag, useActionFlag } from "@/hooks/use-reports";
import FlagsTable from "@/components/admin/reports/FlagsTable";
import AuditLogTable from "@/components/admin/reports/AuditLogTable";
import { cn } from "@/lib/utils";
import type { Flag } from "@/types/report";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

function FullAdminReportsSkeleton({ activeTab }: { activeTab: "flags" | "audit" }) {
  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-24 sm:w-28" />
        <Skeleton className="h-7 sm:h-8 w-36 sm:w-40" />
        <Skeleton className="h-4 w-[320px] sm:w-[420px] max-w-full" />
      </div>

      {/* 2. Tab Selector Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Skeleton className="h-10 sm:h-12 w-32 sm:w-36 rounded-md shrink-0" />
        <Skeleton className="h-10 sm:h-12 w-28 sm:w-32 rounded-md shrink-0" />
      </div>

      {/* 3. Table / Content Skeleton */}
      <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
        <div className="min-w-[750px]">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 py-4 px-4 sm:px-6 border-b-2 border-border bg-card/50">
            {activeTab === "flags" ? (
              <>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">SUBJECT</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">TYPE</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">REASON</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">REPORTS</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide text-right">ACTIONS</p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">ACTION</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">TARGET</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">ADMIN</p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">WHEN</p>
                <div />
              </>
            )}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-5 gap-4 py-4 px-4 sm:px-6 items-center ${
                index < 4 ? "border-b-2 border-border" : ""
              }`}
            >
              <Skeleton className="h-4 w-28 sm:w-36" />
              <Skeleton className="h-4 w-16 sm:w-20" />
              <Skeleton className="h-4 w-24 sm:w-32" />
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-2 justify-end">
                <Skeleton className="h-8 w-16 sm:w-20 rounded-md" />
                <Skeleton className="h-8 w-20 sm:w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"flags" | "audit">("flags");
  const { data: flags, isLoading: flagsLoading } = useFlags();
  const { data: auditLog, isLoading: auditLoading } = useAuditLog();
  const dismissFlag = useDismissFlag();
  const actionFlag = useActionFlag();

  const isLoading = activeTab === "flags" ? flagsLoading : auditLoading;

  const handleDismiss = (flag: Flag) => {
    dismissFlag.mutate({ targetType: flag.targetType, targetId: flag.targetId });
  };

  const handleSuspend = (flag: Flag) => {
    const confirmMessage =
      flag.targetType === "event"
        ? `Remove "${flag.title}"? It will come down site-wide immediately.`
        : `Suspend the organizer behind "${flag.title}"? They'll be logged out and blocked from the platform.`;
    if (!window.confirm(confirmMessage)) return;
    actionFlag.mutate({ targetType: flag.targetType, targetId: flag.targetId });
  };

  if (isLoading) {
    return <FullAdminReportsSkeleton activeTab={activeTab} />;
  }

  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div>
        <p className="text-xs font-medium font-space tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
          Needs action
        </p>
        <h1 className="text-2xl sm:text-[28px] font-grotesk font-bold text-foreground">
          Reports
        </h1>
        <p className="text-sm sm:text-base font-medium text-muted-foreground mt-0.5">
          Flagged events and organizers, plus the full platform audit log
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("flags")}
          className={cn(
            "px-4 sm:px-5 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold flex items-center gap-3 shrink-0 transition-colors",
            activeTab === "flags"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:bg-muted/50"
          )}
        >
          Flags
          <span className="bg-muted-foreground font-space text-background rounded-full px-2 py-0.5 text-xs font-bold">
            {flags?.length ?? 0}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={cn(
            "px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold shrink-0 transition-colors",
            activeTab === "audit"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:bg-muted/50"
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