import ActionBtn from "@/components/ui/action-btn"
import { formatRequestedAgo } from "@/lib/utils"
import { useNavigate } from "react-router"
import type { RefundRequestPopulated, DisputeSummary } from "@/types/refunds"

const REQUEST_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr_180px] gap-4 px-6"
const DISPUTE_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_220px] gap-4 px-6"

interface RequestDisputeTableProps {
    activeTab: "requests" | "disputes"
    refundRequests: RefundRequestPopulated[]
    disputes: DisputeSummary[]
}

const RequestDisputeTable = ({ activeTab, refundRequests, disputes }: RequestDisputeTableProps) => {
    const navigate = useNavigate()

    if (activeTab === "requests") {
        return (
            <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
                <div className={`${REQUEST_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">EVENT</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REASON</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REQUESTED</p>
                    <div />
                </div>

                {refundRequests.map((request, index) => (
                    <div
                        key={request._id}
                        onClick={() => navigate(`/admin/refund-request/${request._id}`)}
                        className={`${REQUEST_GRID_COLS} py-5 items-center rounded-b-[10px] cursor-pointer hover:bg-muted/40 transition-colors dark:border-border ${
                            index < refundRequests.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                                {request.ticket.attendeeName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <p className="font-bold">{request.ticket.attendeeName}</p>
                        </div>

                        <p>{request.event.title}</p>

                        <p className="font-space font-bold">
                            ₦{request.amount.toLocaleString()}
                        </p>

                        <p className="text-muted-foreground">{request.reason}</p>

                        <p className="text-muted-foreground">
                            {formatRequestedAgo(request.createdAt)}
                        </p>

                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <ActionBtn
                                type="button"
                                text="Refund"
                                classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-sm px-4 py-2 h-auto"
                            />
                            <ActionBtn
                                type="button"
                                text="Decline"
                                variant="outline"
                                classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="min-w-[900px] border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
            <div className={`${DISPUTE_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">EVENT</p>
                <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">PROCESSOR</p>
                <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
                <div />
            </div>

            {disputes.map((dispute, index) => (
                <div
                    key={dispute.id}
                    className={`${DISPUTE_GRID_COLS} py-5 items-center rounded-b-[10px] dark:border-border ${
                        index < disputes.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                            {dispute.attendeeInitials}
                        </div>
                        <p className="font-bold">{dispute.attendeeName}</p>
                    </div>

                    <p>{dispute.eventName}</p>

                    <p className="font-space font-bold">
                        ₦{dispute.amount.toLocaleString()}
                    </p>

                    <p className="text-muted-foreground">{dispute.processor}</p>

                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F4DFB6] text-[#7A4E02] capitalize">
                            {dispute.status}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <ActionBtn
                            type="button"
                            text="Challenge"
                            variant="outline"
                            classname="font-bold border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#0F6E56] hover:text-white text-sm px-4 py-2 h-auto"
                        />
                        <ActionBtn
                            type="button"
                            text="Accept loss"
                            variant="outline"
                            classname="font-bold border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RequestDisputeTable