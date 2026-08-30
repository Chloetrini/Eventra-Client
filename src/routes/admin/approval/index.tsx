import { useState } from "react"
import RefundDisputeSelector, { type RefundDisputeTab } from "@/components/admin/refunds-dispute/refund-dispute-selector"
import RequestDisputeTable from "@/components/admin/refunds-dispute/request-dispute-table"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRefundRequests, useAdminDisputes } from "@/hooks/use-admin-refunds"
import type { EventOrganizerTab } from "@/components/admin/approvals/event-organizer-selector"
import { useAdminEvents, usePendingAdminEvents } from "@/hooks/use-admin-events"
import { useAdminOrganizers, usePendingAdminOrganizers } from "@/hooks/use-admin-organizers"
import { usePendingAdminPromotions } from "@/hooks/use-admin-promotions"
import EventOrganizerSelector from "@/components/admin/approvals/event-organizer-selector"
import ApprovalTable from "@/components/admin/approvals/approval-table"


const EVENT_GRID_COLS = "grid grid-cols-[3fr_1fr_1fr_1fr_250px] gap-8 px-6"
const ORGANIZER_GRID_COLS = "grid grid-cols-[2fr_2fr_1fr_1fr_250px] gap-4 px-6"
const PROMOTION_GRID_COLS = "grid grid-cols-[2.5fr_2fr_1.5fr_1fr_1fr] gap-6 px-6"

function EventOrganizerTableSkeleton({ activeTab }: { activeTab: EventOrganizerTab}) {
    const gridCols = activeTab === "events" ? EVENT_GRID_COLS : activeTab === "organizers" ? ORGANIZER_GRID_COLS : PROMOTION_GRID_COLS
    const headers = activeTab === "events"
        ? [ "EVENT", "ORGANIZER", "TYPE", "REQUESTED", "SUBMITTED", "STATUS"]
        : activeTab === "organizers"
            ? ["ORGANIZER", "CONTACT", "BANK", "SUBMITTED" ,"STATUS"]
            : ["EVENT", "ORGANIZER", "PACKAGE", "PRICE", "SUBMITTED"]

    return (
        <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
            <div className={`${gridCols} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                {headers.map((label) => (
                    <p key={label} className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">
                        {label}
                    </p>
                ))}
                {activeTab !== "promotions" && <div />}
            </div>

            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className={`${gridCols} py-5 items-center rounded-b-[10px] dark:border-border ${
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
                    <Skeleton className="h-4 w-20" />
                    {activeTab !== "promotions" && (
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="h-8 w-20 rounded-md" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

const Approval = () => {
    const [activeTab, setActiveTab] = useState<EventOrganizerTab>("events")

    const { data: pendingEvents= [], isLoading: eventLoading } =usePendingAdminEvents();
    const { data: organizersData, isLoading: organizersLoading } = usePendingAdminOrganizers()
    const { data: promotionsData, isLoading: promotionsLoading } = usePendingAdminPromotions()

    const isLoading = activeTab === "events" ? eventLoading : activeTab === "organizers" ? organizersLoading : promotionsLoading
const pendingOrganizer = organizersData?.organizers ?? [];
const pendingPromotions = promotionsData?.promotions ?? [];

    return (
        <PageWrapper className="flex flex-col gap-5 p-[20px]">
            <div>
                <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>NEEDS ACTION</p>
                <h1 className='text-[28px] font-bold font-grotesk'>Approvals</h1>
                <p className='font-medium text-[14px] text-muted-foreground'>Review what’s waiting to go live. Approve to publish or reject with a reason.</p>
            </div>

            <EventOrganizerSelector
                activeTab={activeTab}
                onTabChange={setActiveTab}
                eventsCount={pendingEvents.length}
                organizersCount={pendingOrganizer.length}
                promotionsCount={pendingPromotions.length}
            />

            <div className="w-full overflow-x-auto">
                {isLoading ? (
                    <EventOrganizerTableSkeleton activeTab={activeTab} />
                ) : (
                    <ApprovalTable
                        activeTab={activeTab}
                        events={pendingEvents}
                        organizer={pendingOrganizer}
                        promotions={pendingPromotions}
                        currency={promotionsData?.currency ?? "Naira"}
                    />
                )}
            </div>
        </PageWrapper>
    )
}

export default Approval
