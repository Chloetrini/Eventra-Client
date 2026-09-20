
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
        <p className="text-[16px] min-[400px]:text-sm lg:text-[17px] font-[400] tracking-wide font-geist uppercase text-[#0F6E56] dark:text-[#4ADE80]">
          MANAGE
        </p>
        <h1 className="mt-1 font-grotesk text-[28px] font-[700] text-foreground">
          Organizers
        </h1>
        <p className="mt-1 text-[16px] text-muted-foreground font-geist">
          Event organizer account, their verification status and performance
        </p>
      </div>

      
    </div>
  );
}
