import { useState } from "react"
import { useSearchParams } from "react-router"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventOrganizerTab } from "@/components/admin/approvals/event-organizer-selector"
import { usePendingAdminEvents } from "@/hooks/use-admin-events"
import { usePendingAdminOrganizers } from "@/hooks/use-admin-organizers"
import { usePendingAdminPromotions } from "@/hooks/use-admin-promotions"
import EventOrganizerSelector from "@/components/admin/approvals/event-organizer-selector"
import ApprovalTable from "@/components/admin/approvals/approval-table"

const EVENT_GRID_COLS = "grid grid-cols-[3fr_1fr_1fr_1fr_250px] gap-8 px-6"
const ORGANIZER_GRID_COLS = "grid grid-cols-[2fr_2fr_1fr_1fr_250px] gap-4 px-6"
const PROMOTION_GRID_COLS = "grid grid-cols-[2.5fr_2fr_1.5fr_1fr_1fr] gap-6 px-6"

function FullApprovalSkeleton({ activeTab }: { activeTab: EventOrganizerTab }) {
  const gridCols =
    activeTab === "events"
      ? EVENT_GRID_COLS
      : activeTab === "organizers"
      ? ORGANIZER_GRID_COLS
      : PROMOTION_GRID_COLS

  const headers =
    activeTab === "events"
      ? ["EVENT", "ORGANIZER", "TYPE", "REQUESTED", "SUBMITTED"]
      : activeTab === "organizers"
      ? ["ORGANIZER", "CONTACT", "BANK", "SUBMITTED"]
      : ["EVENT", "ORGANIZER", "PACKAGE", "PRICE", "SUBMITTED"]

  return (
    <PageWrapper className="flex flex-col gap-5 p-[20px]">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* 2. Selector Tabs Skeleton */}
      <div className="flex items-center gap-3 py-2 border-b border-border/40">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* 3. Table Skeleton */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
          {/* Table Header */}
          <div className={`${gridCols} py-4 border-b-2 border-[#E8E6E0] dark:border-border`}>
            {headers.map((label) => (
              <p key={label} className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">
                {label}
              </p>
            ))}
            <div />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`${gridCols} py-5 items-center dark:border-border ${
                index < 4 ? "border-b-2 border-[#E8E6E0]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />

              {activeTab !== "promotions" ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ) : (
                <Skeleton className="h-4 w-20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

const VALID_APPROVAL_TABS: EventOrganizerTab[] = ["events", "organizers", "promotions"]

const Approval = () => {
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get("tab")
  const initialTab: EventOrganizerTab = VALID_APPROVAL_TABS.includes(requestedTab as EventOrganizerTab)
    ? (requestedTab as EventOrganizerTab)
    : "events"

  const [activeTab, setActiveTab] = useState<EventOrganizerTab>(initialTab)

  const { data: pendingEvents = [], isLoading: eventLoading } = usePendingAdminEvents()
  const { data: organizersData, isLoading: organizersLoading } = usePendingAdminOrganizers()
  const { data: promotionsData, isLoading: promotionsLoading } = usePendingAdminPromotions()

  const isLoading =
    activeTab === "events" ? eventLoading : activeTab === "organizers" ? organizersLoading : promotionsLoading

  const pendingOrganizer = organizersData?.organizers ?? []
  const pendingPromotions = promotionsData?.promotions ?? []

  // Block the entire page rendering with full Skeletons until data is loaded
  if (isLoading) {
    return <FullApprovalSkeleton activeTab={activeTab} />
  }

  return (
    <PageWrapper className="flex flex-col gap-5 p-[20px]">
      <div>
        <p className="font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]">NEEDS ACTION</p>
        <h1 className="text-[28px] font-bold font-grotesk">Approvals</h1>
        <p className="font-medium text-[14px] text-muted-foreground">
          Review what’s waiting to go live. Approve to publish or reject with a reason.
        </p>
      </div>

      <EventOrganizerSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
        eventsCount={pendingEvents.length}
        organizersCount={pendingOrganizer.length}
        promotionsCount={pendingPromotions.length}
      />

      <div className="w-full overflow-x-auto">
        <ApprovalTable
          activeTab={activeTab}
          events={pendingEvents}
          organizer={pendingOrganizer}
          promotions={pendingPromotions}
          currency={promotionsData?.currency ?? "Naira"}
        />
      </div>
    </PageWrapper>
  )
}

export default Approval