import { useState, useEffect } from "react";
import { useFlags, useAuditLog } from "@/hooks/use-reports";
import FlagsTable from "@/components/admin/reports/FlagsTable";
import AuditLogTable from "@/components/admin/reports/AuditLogTable";
import { cn } from "@/lib/utils";
import type { Flag } from "@/types/report";
import PageWrapper from "@/components/page-wrapper";

export default function AdminReportsPage() {
    const [activeTab, setActiveTab] = useState<"flags" | "audit">("flags")
    const { data, isLoading: flagsLoading} = useFlags();
    const{data: auditLog, isLoading: auditLoading} = useAuditLog()

    const [flags, setFlags] = useState<Flag[]>([])

    useEffect(() => {
        if (data) setFlags(data);
    }, [data]);

    const handleDismiss = (flagId: string) => {
        setFlags ((prev) => prev.filter((f) => f.id !== flagId))
    }

    const handleSuspend = (flagId: string) => {
        // same as dismiss for now, suspending also removes it from the active flags list
        setFlags((prev) => prev.filter((f) => f.id !== flagId))
    }

    return (
        <PageWrapper className="flex flex-col gap-6 min-w-0 p-[20px]">
            <div>
                <p className="text-[13px] min-[400px]:text-xs font-medium font-space tracking-wide  pt-3 uppercase text-[#0F6E56]">
                   Needs action
                </p>
                <h1 className="text-[28px] font-grotesk min-[400px] font-bold text-[#1A1523]">
                  Reports
                </h1>
                <p className="text-[16px] font-medium min-[400px] text-[#4A4451]">
                 Flagged events and users, plus the full platform audit log
                </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                <button onClick={() => setActiveTab("flags")}
                    className={cn(
                        "px-5 py-3 rounded-md text-[16px] font-semibold flex items-center gap-10 shrink-0",
            activeTab === "flags"
              ? "bg-[#1A1523] text-[#FFFFFF]"
              : "border-[#E8E6E0] border text-[#4A4451]"
                    )}>
                   Flags
                   <span className="bg-[#4A4451] font-space text-[#FFFFFF] rounded-[12.28px] px-[6px] py-[2px] text-xs">
                    {flags?.length ?? 0}
                   </span>
                </button>
                <button onClick={() => setActiveTab("audit")}
                    className={cn(
                        "px-8 py-3 rounded-md text-[16px] font-semibold shrink-0",
            activeTab === "audit"
              ? "bg-[#1A1523] text-white"
              : " border border-[#E8E6E0] text-[#4A4451]"
                    )}>
                    Audit log
                </button>
            </div>

            {activeTab === "flags" ? (
                <FlagsTable flags={flags} 
                isLoading={flagsLoading} 
                onDismiss={handleDismiss}
                onSuspend={handleSuspend}/>
      ) : (
        <AuditLogTable entries={auditLog} isLoading={auditLoading} />
            )}
        </PageWrapper>
    )
}