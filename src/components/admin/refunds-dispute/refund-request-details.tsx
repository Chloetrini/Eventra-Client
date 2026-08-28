import { TriangleAlert } from "lucide-react"
import { formatNaira, formatRequestedAgo } from "@/lib/utils"
import type { RefundRequestPopulated } from "@/types/refunds"

// Same shortening used elsewhere for ticket references (shortenTicketRef
// in lib/events-api.ts) — ticketId is the organizer-facing reference (e.g.
// "TKT-A1B2C3D4"), unlike ticket.code, which is the long, unguessable QR
// secret and was never meant to be shown to an admin as "the reference".
function shortenTicketRef(ticketId: string): string {
    const [, rest] = ticketId.split("-")
    if (!rest) return ticketId
    return `EVT-${rest.slice(0, 4)}`
}

function isWithinRefundWindow(event: {
    startDate: string
    refundPolicy: { type: "no-refunds" | "refund-until-days-before"; daysBefore?: number }
}): boolean {
    if (event.refundPolicy.type === "no-refunds") return false
    const cutoff = new Date(event.startDate)
    cutoff.setDate(cutoff.getDate() - (event.refundPolicy.daysBefore ?? 0))
    return new Date() < cutoff
}

interface RefundRequestDetailsProps {
    request: RefundRequestPopulated
}

const RefundRequestDetails = ({ request }: RefundRequestDetailsProps) => {
    const isNonRefundable = request.event.refundPolicy.type === "no-refunds"
    const withinWindow = isWithinRefundWindow(request.event)

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Order</h2>

                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Attendee</p>
                        <p className="font-bold text-end">{request.ticket.attendeeName}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Event</p>
                        <p className="font-bold text-end">{request.event.title}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Ticket type</p>
                        <p className="font-bold text-end">{request.ticket.ticketType.name}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Reference</p>
                        <p className="font-space font-bold text-end">{shortenTicketRef(request.ticket.ticketId)}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Amount</p>
                        <p className="font-space font-bold text-end">{formatNaira(request.amount, request.currency)}</p>
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
                        <p className="font-bold text-end">{request.reason}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Requested resolution</p>
                        <p className="font-bold text-end">{request.requestedResolution}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Event policy</p>
                        <p className="font-bold text-end">
                            {isNonRefundable
                                ? "No refunds"
                                : `Refunds until ${request.event.refundPolicy.daysBefore} days before`}
                        </p>
                    </div>

                    {request.description && (
                        <div className="py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300 mb-1">What happened</p>
                            <p>{request.description}</p>
                        </div>
                    )}

                    {request.additionalInformation && (
                        <div className="py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300 mb-1">Additional information</p>
                            <p>{request.additionalInformation}</p>
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

            {(request.evidence?.length ?? 0) > 0 && (
                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 mt-5 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Evidence</h2>
                    <div className="flex flex-wrap gap-4">
                        {request.evidence.map((item, index) => (
                            
                                key={item.url}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-[160px] h-[160px] rounded-[12px] overflow-hidden border border-[#E8E6E0] shadow-xl"
                            >
                                <img
                                    src={item.url}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default RefundRequestDetails
