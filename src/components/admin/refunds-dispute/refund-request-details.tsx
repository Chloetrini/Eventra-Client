import { TriangleAlert } from "lucide-react"
import { formatRequestedAgo } from "@/lib/utils"
import type { RefundRequestEvent, RefundRequestPopulated } from "@/types/refunds"

function isWithinRefundWindow(event: RefundRequestEvent): boolean {
    if (!event.refundPolicy || event.refundPolicy.type === "no-refunds") return false
    if (!event.startDate) return false
    const cutoff = new Date(event.startDate)
    cutoff.setDate(cutoff.getDate() - (event.refundPolicy.daysBefore ?? 0))
    return new Date() < cutoff
}

interface RefundRequestDetailsProps {
    request: RefundRequestPopulated
}

const RefundRequestDetails = ({ request }: RefundRequestDetailsProps) => {
    const event = request.event
    const ticket = request.ticket
    const isNonRefundable = !event?.refundPolicy || event.refundPolicy.type === "no-refunds"
    const withinWindow = event ? isWithinRefundWindow(event) : false

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Order</h2>

                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Attendee</p>
                        <p className="font-bold text-end">{ticket?.attendeeName ?? "Deleted ticket"}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Event</p>
                        <p className="font-bold text-end">{event?.title ?? "Deleted event"}</p>
                    </div>
                    {ticket?.ticketType && (
                        <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300">Ticket type</p>
                            <p className="font-bold text-end">{ticket.ticketType.name}</p>
                        </div>
                    )}
                    {ticket?.code && (
                        <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300">Reference</p>
                            <p className="font-space font-bold text-end">{ticket.code}</p>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Amount</p>
                        <p className="font-space font-bold text-end">₦{request.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <p className="text-[#4A4451] dark:text-gray-300">Requested</p>
                        <p className="font-bold text-end">{formatRequestedAgo(request.createdAt)}</p>
                    </div>
                </div>

                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Reason & policy</h2>

                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Attendee reason</p>
                        <p className="font-bold text-end">{request.reason || "Not provided"}</p>
                    </div>
                    <div className="py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Event policy</p>
                        <p className="font-bold text-end mt-1">
                            {isNonRefundable
                                ? "No refunds"
                                : `Refunds until ${event?.refundPolicy?.daysBefore ?? 0} days before`}
                        </p>
                    </div>

                    {request.rejectionReason && (
                        <div className="py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300 mb-1">Decline reason</p>
                            <p>{request.rejectionReason}</p>
                        </div>
                    )}

                    <div className="pt-3">
                        {isNonRefundable ? (
                            <p className="flex items-start gap-2 text-sm text-[#BE2525]">
                                <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                This event is marked non-refundable. Approving overrides the organizer policy.
                            </p>
                        ) : withinWindow ? (
                            <p className="text-sm text-[#4A4451]">
                                This request appears to fall within the event refund window
                            </p>
                        ) : (
                            <p className="flex items-start gap-2 text-sm text-[#BE2525]">
                                <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                This request falls outside the event's refund window. Approving overrides the policy.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default RefundRequestDetails
