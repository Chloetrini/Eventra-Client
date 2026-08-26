import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminOrganizerFilterBar, { type OrganizerStatusFilterOption } from "@/components/admin/organizer/AdminOrganizerFilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/page-wrapper";
import { useAdminOrganizers } from "@/hooks/use-admin-organizers";
import AdminOrganizerHeader from "@/components/admin/organizer/AdminOrganizersHeader";
import AdminOrganizersTable from "@/components/admin/organizer/AdminOrganizersTable";

export default function AdminOrganizerPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrganizerStatusFilterOption>("all");

  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Rename query response to `data` to extract organizers array clearly
  const { data, isLoading } = useAdminOrganizers(activeFilter, debouncedQuery);

  const organizersList = data?.organizers ?? [];

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <AdminOrganizerHeader 
        organizers={organizersList} 
      />

      <AdminOrganizerFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <AdminOrganizersTable organizers={organizersList} />
      )}
    </PageWrapper>
  );
}