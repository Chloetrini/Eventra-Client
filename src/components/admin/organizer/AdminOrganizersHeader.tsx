
import type { AdminOrganizer } from "@/types/admin-organizer";

interface AdminOrganizersHeaderProps {
  organizers: AdminOrganizer[];
  selectedOrganizerId?: string;
  
  
}

export default function AdminOrganizerHeader({
  organizers,
  selectedOrganizerId
}: AdminOrganizersHeaderProps) {
  const selectedOrganizers =
    organizers.find((e) => e._id === selectedOrganizerId) || organizers[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Eyebrow & Title */}
      <div>
        <p className="text-xs font-medium tracking-widest text-[#0A4F41] dark:text-[#4ADE80] font-geist  uppercase">
          MANAGE
        </p>
        <h1 className="mt-1 font-grotesk text-3xl font-bold text-foreground">
          Organizers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-geist">
          Event organizer account, their verification status and performance
        </p>
      </div>

      
    </div>
  );
}
