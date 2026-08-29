import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Check, X } from "lucide-react"
import ActionBtn from "@/components/ui/action-btn"
import PaymentBtn from "@/components/ui/pay-method-btn"
import { Separator } from "@/components/ui/separator"
import {
  useAdminOrganizerDetail,
  useApproveOrganizer,
  useRejectOrganizer,
} from "@/hooks/use-admin-organizers"
import OrganizerApprovalDetails from "@/components/admin/organizer/Admin-organizer-details"
import { toast } from "react-toastify"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

function OrganizerApprovalDetailSkeleton() {
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

const OrganizerApprovalDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: organizer, isLoading, isError } = useAdminOrganizerDetail(id)
  const approveMutation = useApproveOrganizer()
  const rejectMutation = useRejectOrganizer()

  if (isLoading) return <OrganizerApprovalDetailSkeleton />

  if (isError || !organizer) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Couldn't find that organizer.
      </div>
    )
  }

  const isPending = organizer.status === "PENDING"

  const handleApprove = () => {
    if (!id) return
    approveMutation.mutate(id, {
      onSuccess: () => toast.success("Organizer verified successfully"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not verify organizer"),
    })
  }

  const handleReject = () => {
    if (!id) return
    rejectMutation.mutate(
      { id },
      {
        onSuccess: () => toast.success("Organizer application rejected"),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not reject application"),
      }
    )
  }

  return (
    <PageWrapper className="min-h-screen flex flex-col justify-between p-[20px]">
      <div>
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/organizers")}
            className="flex items-center gap-2 font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80] mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO APPROVALS
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold font-grotesk">{organizer.name}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F4DFB6] text-[#7A4E02] tracking-wide uppercase">
              {organizer.status === "PENDING" ? "PENDING VERIFICATION" : organizer.status}
            </span>
          </div>
          <p className="font-medium text-[14px] text-muted-foreground">{organizer.email}</p>
        </div>

        <OrganizerApprovalDetails organizer={organizer} />
      </div>

      {isPending && (
        <div className="mt-10 md:mt-0">
          <Separator />
          <div className="flex flex-col-reverse gap-3 md:flex-row items-center justify-between mt-7">
            <p className="text-sm text-muted-foreground text-center md:text-start">
              Verify the bank details and documents before approving.
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
                text="Approve organizer"
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

export default OrganizerApprovalDetailPage