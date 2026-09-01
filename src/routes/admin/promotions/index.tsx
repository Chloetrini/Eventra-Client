import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPromotionsFilterBar, {
  type PromotionStatusFilterOption,
} from "@/components/admin/promotions/AdminPromotionsFilterBar";
import AdminPromotionsTable from "@/components/admin/promotions/AdminPromotionsTable";
import { useAdminPromotions } from "@/hooks/use-admin-promotions";
import type { AdminPromotion } from "@/types/admin-promotion";

// Mirrors AdminEventsPage (routes/admin/events) — same header/filter/table
// shape, just for promotions. Every promotion ever requested lives here
// across every status, unlike the Approvals page's Promotions tab which
// only ever shows what's still awaiting review and drops a row the moment
// it's actioned.
export default function AdminPromotionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PromotionStatusFilterOption>("all");

  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { data, isLoading } = useAdminPromotions(activeFilter, debouncedQuery);
  const promotions = data?.promotions ?? [];

  const handleRowClick = (promotion: AdminPromotion) => {
    navigate(`/admin/promotions/${promotion.eventId}`);
  };

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <div>
        <p className="text-xs font-medium tracking-widest text-[#0A4F41] dark:text-[#4ADE80] font-geist uppercase">
          MANAGE
        </p>
        <h1 className="mt-1 font-grotesk text-3xl font-bold text-foreground">
          Promotions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-geist">
          Every promotion ever requested, who requested it, and when it goes live or expires.
        </p>
      </div>

      <AdminPromotionsFilterBar
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
        <AdminPromotionsTable
          promotions={promotions}
          currency={data?.currency ?? "Naira"}
          onRowClick={handleRowClick}
        />
      )}
    </PageWrapper>
  );
}
