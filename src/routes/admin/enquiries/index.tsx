import { useState } from "react";
import { useEnquiries } from "@/hooks/useEnquiries";
import EnquiriesTable from "@/components/admin/enquiries/EnquiriesTable";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

function AdminEnquiriesSkeleton() {
  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-24 sm:w-28" />
        <Skeleton className="h-7 sm:h-8 w-36 sm:w-40" />
        <Skeleton className="h-4 w-[320px] sm:w-[420px] max-w-full" />
      </div>

      <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-4 gap-4 py-4 px-4 sm:px-6 border-b-2 border-border bg-card/50">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">FROM</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">SUBJECT</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">STATUS</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide text-right">RECEIVED</p>
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 gap-4 py-4 px-4 sm:px-6 items-center ${
                index < 4 ? "border-b-2 border-border" : ""
              }`}
            >
              <Skeleton className="h-4 w-28 sm:w-36" />
              <Skeleton className="h-4 w-32 sm:w-48" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default function AdminEnquiriesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEnquiries(page);

  if (isLoading) {
    return <AdminEnquiriesSkeleton />;
  }

  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div>
        <p className="text-xs font-medium font-space tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
          Needs action
        </p>
        <h1 className="text-2xl sm:text-[28px] font-grotesk font-bold text-foreground">
          Enquiries
        </h1>
        <p className="text-sm sm:text-base font-medium text-muted-foreground mt-0.5">
          Messages submitted through the contact form
        </p>
      </div>

      <EnquiriesTable enquiries={data?.enquiries} isLoading={isLoading} />

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button
            disabled={data.meta.currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="font-medium disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {data.meta.currentPage} of {data.meta.totalPages}</span>
          <button
            disabled={!data.meta.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </PageWrapper>
  );
}