import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAdminOrganizers } from "@/hooks/use-admin-organizers";
import AdminOrganizerFilterBar, {
  type OrganizerStatusFilterOption,
} from "@/components/admin/organizer/AdminOrganizerFilterBar";
import AdminOrganizerTable from "@/components/admin/organizer/AdminOrganizersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AdminEventsHeader from "@/components/admin/events/AdminEventsHeader";
import AdminOrganizerHeader from "@/components/admin/organizer/AdminOrganizersHeader";

const PAGE_SIZE = 20;

export default function AdminOrganizerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const activeFilter =
    (searchParams.get("status") as OrganizerStatusFilterOption) ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Debounce typing so search updates live after 300ms pause
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        params.set("q", searchInput.trim());
      } else {
        params.delete("q");
      }
      setSearchParams(params, { replace: true });
      setLimit(PAGE_SIZE);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useAdminOrganizers({
    page: 1,
    limit,
    q: searchQuery || undefined,
    status: activeFilter,
  });

  const organizersList = Array.isArray(data) ? data : data?.organizers ?? [];
  const meta = !Array.isArray(data) ? data?.meta : undefined;

  const handleFilterChange = (status: OrganizerStatusFilterOption) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
    setLimit(PAGE_SIZE);
  };

  const hasMore = meta
    ? meta.hasMore ?? (meta.page * meta.limit < meta.totalCount)
    : false;

  return (
    <div className="flex flex-col gap-6 p-5">
      <AdminOrganizerHeader
       organizers={organizersList}
     />
      <AdminOrganizerFilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center py-12 text-sm text-destructive">
          Failed to load organizers.
        </p>
      ) : (
        <>
          <AdminOrganizerTable organizers={organizersList} />

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}