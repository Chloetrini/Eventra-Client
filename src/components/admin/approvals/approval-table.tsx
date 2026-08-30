import { useState } from "react"
import ActionBtn from "@/components/ui/action-btn"
import { formatRequestedAgo, formatNaira } from "@/lib/utils"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import type { AdminOrganizer } from "@/types/admin-organizer"
import type { AdminEvent } from "@/types/admin-event"
import type { AdminPromotionListItem } from "@/types/admin-promotion"
import { useApproveEvent, useRejectEvent } from "@/hooks/use-admin-events"
import { useApproveOrganizer, useRejectOrganizer } from "@/hooks/use-admin-organizers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApproveEventPromotion, useRejectEventPromotion } from "@/hooks/use-admin-promotions"

const EVENT_GRID_COLS = "grid grid-cols-[3fr_1fr_1fr_1fr_250px] gap-8 px-6"
const ORGANIZER_GRID_COLS = "grid grid-cols-[2fr_2fr_1fr_1fr_250px] gap-4 px-6"
const PROMOTION_GRID_COLS = "grid grid-cols-[2fr_1.5fr_1fr_1fr_250px] gap-4 px-6"

interface ApprovalTableProps {
  activeTab: "events" | "organizers" | "promotions"
  organizer: AdminOrganizer[]
  events: AdminEvent[]
  promotions: AdminPromotionListItem[]
  currency: string
}

function initialsFor(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  return initials || "?"
}

export function formatBankDetails(bankName?: string, accountNumber?: string): string {
  if (!bankName && !accountNumber) return "N/A"
  const formattedBank = bankName ?? "Bank"
  if (!accountNumber) return formattedBank
  const lastFour = accountNumber.slice(-4)
  return `${formattedBank} ••••${lastFour}`
}

const ApprovalTable = ({ activeTab, events, organizer, promotions }: ApprovalTableProps) => {
  const navigate = useNavigate()
  const approveEvent = useApproveEvent()
  const rejectEvent = useRejectEvent()
  const approveOrganizer = useApproveOrganizer()
  const rejectOrganizer = useRejectOrganizer()
  const approvePromotion = useApproveEventPromotion()
  const rejectPromotion = useRejectEventPromotion()

  // Track event selected for decline dialogue
  const [eventTarget, setEventTarget] = useState<{ id: string; title: string } | null>(null)
  const [declineReason, setDeclineReason] = useState("")

  const handleApproveEvent = (eventId: string) => {
    approveEvent.mutate(eventId, {
      onSuccess: () => toast.success("Event approved"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not approve this event"),
    })
  }

  const handleConfirmRejectEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTarget || !declineReason.trim()) return

    rejectEvent.mutate(
      { id: eventTarget.id, reason: declineReason.trim() },
      {
        onSuccess: () => {
          toast.success("Event rejected")
          setEventTarget(null)
          setDeclineReason("")
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not reject this event"),
      }
    )
  }

  const handleApproveOrganizer = (organizerId: string) => {
    approveOrganizer.mutate(organizerId, {
      onSuccess: () => toast.success("Organizer verified"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not approve this organizer"),
    })
  }

  // Direct rejection without dialogue
  const handleRejectOrganizer = (orgId: string) => {
    rejectOrganizer.mutate(
      { id: orgId },
      {
        onSuccess: () => toast.success("Organizer rejected"),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not reject this organizer"),
      }
    )
  }
  const handleApprovePromotion = (promotionId: string) => {
    approvePromotion.mutate(promotionId, {
      onSuccess: () => toast.success("Promotion approved"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not approve this promotion"),
    })
  }

  // Direct rejection without dialogue
  const handleRejectPromotion = (promotionId: string) => {
    rejectPromotion.mutate(
      promotionId,
      {
        onSuccess: () => toast.success("Promotion rejected"),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not reject this promotion"),
      }
    )
  }

  if (activeTab === "events") {
    return (
      <>
        <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
          <div className={`${EVENT_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px] w-full`}>
            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">EVENT</p>
            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">ORGANIZER</p>
            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">TYPE</p>
            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">SUBMITTED</p>
            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
            <div />
          </div>

          {events.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No event right now.
            </p>
          )}

          {events.map((event, index) => {
            const isThisApproving = approveEvent.isPending && approveEvent.variables === event._id
            const isThisDeclining = rejectEvent.isPending && rejectEvent.variables?.id === event._id

            return (
              <div
                key={event._id}
                onClick={() => navigate(`/admin/events/${event._id}`)}
                className={`${EVENT_GRID_COLS} py-5 items-center rounded-b-[10px] cursor-pointer hover:bg-muted/40 transition-colors dark:border-border ${index < events.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                    {initialsFor(event.title)}
                  </div>
                  <p className="font-bold">{event.title}</p>
                </div>

                <p>{event.organizerName}</p>
                <p className="font-space font-bold">{event.type}</p>
                <p className="text-muted-foreground">{formatRequestedAgo(event.createdAt)}</p>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <ActionBtn
                    type="button"
                    text="Approve"
                    loading={isThisApproving}
                    disabled={approveEvent.isPending || rejectEvent.isPending}
                    onClick={() => handleApproveEvent(event._id)}
                    classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-sm px-4 py-2 h-auto"
                  />
                  <ActionBtn
                    type="button"
                    text="Reject"
                    variant="outline"
                    loading={isThisDeclining}
                    disabled={approveEvent.isPending || rejectEvent.isPending}
                    onClick={() => setEventTarget({ id: event._id, title: event.title })}
                    classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Event Rejection Modal */}
        <Dialog open={Boolean(eventTarget)} onOpenChange={(open) => !open && setEventTarget(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleConfirmRejectEvent}>
              <DialogHeader>
                <DialogTitle className="font-grotesk text-xl font-bold">Reject Event</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting <span className="font-semibold text-foreground">{eventTarget?.title}</span>.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <textarea
                  required
                  minLength={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Invalid ticket details or policy violation"
                  className="w-full h-28 p-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <ActionBtn
                  type="button"
                  text="Cancel"
                  variant="outline"
                  disabled={rejectEvent.isPending}
                  onClick={() => setEventTarget(null)}
                />
                <ActionBtn
                  type="submit"
                  text="Reject Event"
                  loading={rejectEvent.isPending}
                  disabled={rejectEvent.isPending || declineReason.trim().length < 3}
                  classname="bg-[#BE2525] hover:bg-[#A11D1D] text-white"
                />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (activeTab === "promotions") {
    return (
      <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
        <div className={`${PROMOTION_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
          <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">EVENT</p>
          <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">ORGANIZER</p>
          <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">PACKAGE</p>
          <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">SUBMITTED</p>
          <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
        </div>

        {promotions.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No promotion requests right now.
          </p>
        )}

        {promotions.map((promo, index) => {
          const isThisApproving = approvePromotion.isPending && approveEvent.variables === promo.eventId
          const isThisDeclining = rejectEvent.isPending && rejectEvent.variables?.id === promo.eventId
          return (
            <div
              key={promo.eventId}
              onClick={() => navigate(`/admin/promotions/${promo.eventId}`)}
              className={`${PROMOTION_GRID_COLS} py-5 items-center rounded-b-[10px] cursor-pointer hover:bg-muted/40 transition-colors dark:border-border ${index < promotions.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                  {initialsFor(promo.eventTitle)}
                </div>
                <p className="font-bold">{promo.eventTitle}</p>
              </div>

              <p className="truncate">{promo.organizerName}</p>
              <p className="font-space font-bold">{promo.packageLabel}</p>
              <p className="text-muted-foreground">
                {promo.paidAt ? formatRequestedAgo(promo.paidAt) : "—"}
              </p>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <ActionBtn
                  type="button"
                  text="Approve"
                  loading={isThisApproving}
                  disabled={approvePromotion.isPending || rejectPromotion.isPending}
                  onClick={() => handleApprovePromotion(promo.eventId)}
                  classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-sm px-4 py-2 h-auto"
                />
                <ActionBtn
                  type="button"
                  text="Reject"
                  variant="outline"
                  loading={isThisDeclining}
                  disabled={approvePromotion.isPending || rejectPromotion.isPending}
                  onClick={() => handleRejectPromotion(promo.eventId)}
                  classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
      <div className={`${ORGANIZER_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ORGANIZER</p>
        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">CONTACT</p>
        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">BANK</p>
        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">SUBMITTED</p>
        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
        <div />
      </div>

      {organizer.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No organizer right now.
        </p>
      )}

      {organizer.map((org, index) => {
        const isThisVerifying = approveOrganizer.isPending && approveOrganizer.variables === org._id
        const isThisRejecting = rejectOrganizer.isPending && rejectOrganizer.variables?.id === org._id

        return (
          <div
            key={org._id}
            onClick={() => navigate(`/admin/organizers/${org._id}`)}
            className={`${ORGANIZER_GRID_COLS} py-5 items-center rounded-b-[10px] dark:border-border ${index < organizer.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                {org.avatarUrl ? (
                  <img src={org.avatarUrl} alt={org.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
                    {org.initials}
                  </div>
                )}
              </div>
              <p>{org.name}</p>
            </div>
            <p>{org.email}</p>
            <p className="font-bold">
              {formatBankDetails(org.details?.bankDetails?.bankName, org.details?.bankDetails?.accountNumber)}
            </p>
            <p className="text-muted-foreground">
              {formatRequestedAgo(org.createdAt)}
            </p>

            <div className="flex gap-2">
              <ActionBtn
                type="button"
                text="Verify"
                variant="outline"
                loading={isThisVerifying}
                disabled={approveOrganizer.isPending || rejectOrganizer.isPending}
                onClick={() => handleApproveOrganizer(org._id)}
                classname="font-bold border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#0F6E56] hover:text-white text-sm px-4 py-2 h-auto"
              />
              <ActionBtn
                type="button"
                text="Reject"
                variant="outline"
                loading={isThisRejecting}
                disabled={approveOrganizer.isPending || rejectOrganizer.isPending}
                onClick={() => handleRejectOrganizer(org._id)}
                classname="font-bold border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ApprovalTable
