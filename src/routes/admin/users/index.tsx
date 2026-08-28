import { useState } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { AdminUserStatusFilter } from "@/types/admin-users";
import PageWrapper from "@/components/page-wrapper";

const FILTERS: { value: AdminUserStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const activeFilter = (searchParams.get("status") as AdminUserStatusFilter) ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isLoading, isError } = useAdminUsers({
    page: 1,
    limit,
    q: searchQuery || undefined,
    status: activeFilter,
  });

  const handleFilterChange = (status: AdminUserStatusFilter) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
    setLimit(PAGE_SIZE);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
    setLimit(PAGE_SIZE);
  };

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <div>
        <p className="text-[16px] min-[400px]:text-sm lg:text-[16px] font-medium tracking-wide uppercase text-[#0A4F41] dark:text-[#4ADE80]">
          Manage
        </p>
        <h1 className="text-[34px] leading-[40px] font-grotesk font-semibold text-foreground mt-1">
          Users
        </h1>
        <p className="text-[16px] leading-[26px] font-medium min-[400px]:text-sm lg:text-[16px] text-muted-foreground mt-1">
          Attendee accounts across the platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground bg-background border border-border rounded-[7px] outline-none"
          />
        </form>
        <div className="flex w-full lg:w-auto gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-[7px] font-medium border transition-colors shrink-0",
                activeFilter === filter.value
                  ? "bg-[#0A4F41] text-[#FFFFFF] border-[#0A4F41] font-bold text-[15px] dark:bg-[#0F6E56] dark:border-[#0F6E56]"
                  : "bg-card text-[16px] text-muted-foreground border border-border"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center py-12 text-sm text-destructive">
          Something went wrong loading users
        </p>
      ) : (
        <>
          <UsersTable users={data?.users ?? []} currency={data?.currency} />
          {data?.meta.hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
