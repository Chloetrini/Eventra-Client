
import type { AdminEvent } from "@/types/admin-event";

interface AdminEventsHeaderProps {
  events: AdminEvent[];
  selectedEventId?: string;
  onSelectEvent?: (eventId: string) => void;
  totalEvents?: number;
  checkedInCount?: number;
  notInCount?: number;
}

export default function AdminEventsHeader({
  events,
  selectedEventId,
  // onSelectEvent,
  // totalEvents = 8,
  // checkedInCount = 3,
  // notInCount = 5,
}: AdminEventsHeaderProps) {
  const selectedEvent =
    events.find((e) => e._id === selectedEventId) || events[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Eyebrow & Title */}
      <div>
        <p className="text-xs font-medium tracking-widest text-[#0A4F41] dark:text-[#4ADE80] font-geist  uppercase">
          MANAGE
        </p>
        <h1 className="mt-1 font-grotesk text-3xl font-bold text-foreground">
          Events
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-geist">
          Every event on the platform. Moderate or remove any of them.
        </p>
      </div>

      
    </div>
  );
}
