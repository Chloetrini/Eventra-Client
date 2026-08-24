import { useQuery } from "@tanstack/react-query";
// import { getFlags, getAuditLog } from "@/lib/api/admin";
import { mockFlags, mockAuditLog } from "@/lib/report-mock-data";
import type { Flag, AuditLogEntry } from "@/types/report";

export function useFlags() {
    return useQuery<Flag[]> ({
        queryKey: ["admin", "reports", "flags"],
        queryFn: async() => {
            // Real call, once the backend endpoint exists:
      // return getFlags();
    //   Mock, pending backend

    await new Promise ((resolve) => setTimeout(resolve, 300));
    return mockFlags
        }
    });
}

export function useAuditLog() {
    return useQuery<AuditLogEntry[]> ({
        queryKey: ["admin", "reports", "auditLog"],
        queryFn: async() => {
            // Real call, once the backend endpoint exists:
      // return getAuditLog();

      // Mock, pending backend:
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockAuditLog
        }
    })
}