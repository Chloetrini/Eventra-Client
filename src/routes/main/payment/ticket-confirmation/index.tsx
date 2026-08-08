import ConfirmatoryMessage from "@/components/confirmatory-message"
import { TicketCard } from "@/components/ticket-card"
import { useLocation, useNavigate } from "react-router"
import type { Ticket } from "@/types/ticket"

const TicketConfirmation = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const order = location.state as {
        eventId: string
        eventName: string
        eventImage: string | null
        eventDateTime: string
        eventVenue: string
        ticketDetails: { id: number; type: string; unitPrice: number; quantity: number }[]
        subtotal: number
        serviceFee: number
        total: number
    } | null

    const recipientEmail = "oghenekevwet@gmail.com"

    if (!order) {
        return (
            <div className='px-4 py-20 text-center'>
                <p className='mb-4 text-[#6E6577]'>No ticket to show.</p>
                <button
                    onClick={() => navigate('/explore')}
                    className='text-[#6e6e6e] font-semibold underline'
                >
                    Browse events
                </button>
            </div>
        )
    }

    const ticket: Ticket = {
        _id: order.eventId,
        eventName: order.eventName,
        category: [],
        eventDateTime: order.eventDateTime,
        eventEntrance: "Main entrance",
        eventVenue: order.eventVenue,
        referenceCode: "EVT-PENDING",
        orderID: "0001",
        holderName: "Guest",
        admits: `Admit ${order.ticketDetails.reduce((s, t) => s + t.quantity, 0)}`,
        ticketDetails: order.ticketDetails.map((t) => ({
            type: t.type,
            unitPrice: t.unitPrice,
            quantity: t.quantity,
        })),
        qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${order.eventId}-${order.eventName.replace(/\s+/g, "-")}`,
        refundPolicy: {
            type: "refundable",
            note: "Refunds allowed until 3 days before the event.",
        },
    }

    return (
        <div className='flex flex-col justify-center items-center mx-auto container px-20 pt-10 pb-2 gap-10'>
            <div className='flex justify-center items-center w-full'>
                <ConfirmatoryMessage
                    _id="1"
                    eventName={ticket.eventName}
                    orderID={ticket.orderID}
                    eventDateTime=""
                    ticketDetails={[]}
                />
            </div>
            <div className="w-full">
                <TicketCard
                    ticket={ticket}
                />
                <p className="mt-5 text-center lg:text-left">A copy has been sent to <span className="font-bold font-grotesk text-lg sm:text-xl break-words">{recipientEmail}</span>. Tickets are also saved to your account.</p>
            </div>
        </div>
    )
}

export default TicketConfirmation
