import type { TopOrganizer } from "@/types/overview";

export default function OrganizerRow({ organizer }: { organizer: TopOrganizer }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground">{organizer.name}</span>
      <span className="font-medium text-foreground">{organizer.revenue}</span>
    </div>
  );
}