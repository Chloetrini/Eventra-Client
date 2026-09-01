import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Check } from "lucide-react"
import { toast } from "react-toastify"
import ActionBtn from "@/components/ui/action-btn"
import PaymentBtn from "@/components/ui/pay-method-btn"
import { Separator } from "@/components/ui/separator"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNaira, formatDate } from "@/lib/utils"
import {
  useAdminPromotionDetail,
  useApproveEventPromotion,
  useRejectEventPromotion,
} from "@/hooks/use-admin-promotions"

function PromotionDetailSkeleton() {
  return (
    <PageWrapper className="min-h-screen flex flex-col justify-between p-[20px]">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64 mt-2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <Skeleton className="h-64 w-full rounded-[10px]" />
          <Skeleton className="h-64 w-full rounded-[10px]" />
        </div>
      </div>
    </PageWrapper>
  )
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#F4DFB6] text-[#7A4E02]",
  approved: "bg-[#E4F1EB] text-[#0F6E56]",
  expired: "bg-[#E8E6E0] text-[#3A3A3A]",
  rejected: "bg-[#FFC4C4] text-[#BE2525]",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "PENDING REVIEW",
  approved: "ACTIVE",
  expired: "EXPIRED",
  rejected: "REJECTED",
}

const AdminPromotionDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()

  const { data: promotion, isLoading, isError } = useAdminPromotionDetail(eventId)
  const approveMutation = useApproveEventPromotion()
  const rejectMutation = useRejectEventPromotion()

  if (isLoading) return <PromotionDetailSkeleton />

  if (isError || !promotion) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Couldn't find that promotion request.
      </div>
    )
  }

  const isPending = promotion.status === "pending"

  const handleApprove = () => {
    if (!eventId) return
    approveMutation.mutate(eventId, {
      onSuccess: () => toast.success("Promotion approved"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not approve this promotion"),
    })
  }

  const handleReject = () => {
    if (!eventId) return
    rejectMutation.mutate(eventId, {
      onSuccess: () => toast.success("Promotion rejected"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not reject this promotion"),
    })
  }

  return (
    <PageWrapper className="min-h-screen flex flex-col justify-between p-[20px]">
      <div>
        <div>
          <button
            type="button"
            // Was hardcoded to /admin/approvals — right when this was only
            // ever reached from the Approvals page's Promotions tab, but
            // it's now also reachable from the standalone Promotions list
            // (which shows every status, not just pending). Going back to
            // wherever the click actually came from works for both.
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80] mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold font-grotesk">{promotion.eventTitle}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                STATUS_STYLES[promotion.status] ?? STATUS_STYLES.pending
              }`}
            >
              {STATUS_LABELS[promotion.status] ?? promotion.status}
            </span>
          </div>
          <p className="font-medium text-[14px] text-muted-foreground">
            Requested by {promotion.organizer.name}
            {promotion.organizer.email ? ` · ${promotion.organizer.email}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="rounded-[10px] border-2 border-[#E8E6E0] dark:border-border p-6">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Promotion package
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-bold">{promotion.packageLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Placement</span>
                <span className="font-bold text-right">{promotion.placementLabel ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price paid</span>
                <span className="font-bold font-space">
                  {promotion.price === null ? "—" : formatNaira(promotion.price, promotion.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold">
                  {promotion.durationDays ? `${promotion.durationDays} days` : "—"}
                </span>
              </div>
              {promotion.packageDescription && (
                <p className="text-muted-foreground pt-2 border-t border-border">
                  {promotion.packageDescription}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[10px] border-2 border-[#E8E6E0] dark:border-border p-6">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Request details
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event</span>
                <span className="font-bold text-right">{promotion.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-bold">{promotion.eventCategory ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event date</span>
                <span className="font-bold">
                  {promotion.eventStartDate ? formatDate(promotion.eventStartDate) : "TBA"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid on</span>
                <span className="font-bold">
                  {promotion.paidAt ? formatDate(promotion.paidAt) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paystack reference</span>
                <span className="font-bold text-right break-all">
                  {promotion.paystackReference ?? "—"}
                </span>
              </div>
              {(promotion.status === "approved" || promotion.status === "expired") && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Live from</span>
                    <span className="font-bold">
                      {promotion.startsAt ? formatDate(promotion.startsAt) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Live until</span>
                    <span className="font-bold">
                      {promotion.endsAt ? formatDate(promotion.endsAt) : "—"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="mt-10 md:mt-0">
          <Separator />
          <div className="flex flex-col-reverse gap-3 md:flex-row items-center justify-between mt-7">
            <p className="text-sm text-muted-foreground text-center md:text-start">
              Confirm the package and payment before approving this promotion.
            </p>
            <div className="flex w-full md:w-fit justify-between md:gap-2">
              <ActionBtn
                type="button"
                text="Reject"
                variant="outline"
                loading={rejectMutation.isPending}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={handleReject}
                classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white px-5 py-3 h-auto font-bold"
              />
              <PaymentBtn
                icon={Check}
                text="Approve promotion"
                loading={approveMutation.isPending}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={handleApprove}
                classname="bg-[#0F6E56] hover:bg-[#095341] text-white px-5 py-3 h-auto font-bold hover:text-white dark:text-[#4ADE80] dark:hover:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

export default AdminPromotionDetailPage
