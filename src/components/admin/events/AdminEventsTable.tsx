import React from "react";
import type {
  AdminEvent,
  AdminEventStatus,
  AdminPaymentType,
} from "@/types/admin-event";

interface AdminEventsTableProps {
  events: AdminEvent[];
  onEventClick?: (event: AdminEvent) => void;
}

export function StatusBadge({ status }: { status: AdminEventStatus }) {
  switch (status) {
    case "LIVE":
      return (
        <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/25 px-3 py-1 text-[11px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wide">
          LIVE
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-3 py-1 text-[11px] font-bold text-[#7A4E02] dark:text-[#FBBF24] uppercase tracking-wide">
          PENDING
        </span>
      );
    case "FLAGGED":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3.5 py-1 text-[11px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wide">
          FLAGGED
        </span>
      );
    case "PAST":
      return (
        <span className="inline-flex items-center rounded-full bg-[#E8E6E0] px-3 py-1 text-[11px] font-bold text-[#3A3A3A] uppercase tracking-wide">
          PAST
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3 py-1 text-[11px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wider">
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

export function TypeBadge({ type }: { type: AdminPaymentType }) {
  if (type === "PAID") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wider">
        PAID
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#FDF6E2] dark:bg-[#8C6B16]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#A16207] dark:text-[#FACC15] uppercase tracking-wider">
      FREE
    </span>
  );
}

export default function AdminEventsTable({
  events,
  onEventClick,
}: AdminEventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No events match your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">EVENT</th>
              <th className="px-6 py-4">ORGANIZER</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">SOLD</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((evt) => (
              <tr
                key={evt.id}
                onClick={() => onEventClick?.(evt)}
                className="group cursor-pointer hover:bg-accent/50 transition-colors"
              >
                {/* EVENT (Avatar + Title) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white shadow-xs">
                      {evt.organizerInitials}
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {evt.title}
                    </span>
                  </div>
                </td>

                {/* ORGANIZER */}
                <td className="px-6 py-4 font-medium text-muted-foreground">
                  {evt.organizerName}
                </td>

                {/* TYPE */}
                <td className="px-6 py-4">
                  <TypeBadge type={evt.type} />
                </td>

                {/* SOLD */}
                <td className="px-6 py-4 font-bold text-foreground">
                  {evt.soldText}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <StatusBadge status={evt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
