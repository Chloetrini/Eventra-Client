import ConfirmatoryMessage from "@/components/confirmatory-message"
import { TicketCard } from "@/components/tickets/ticket-card"
import { useLocation, useNavigate } from "react-router"
import PaymentBtn from "@/components/ui/pay-method-btn"
import calendar from "@/assets/calendar.png";

const TicketConfirmation = () => {
    const location = useLocation()
    const navigate = useNavigate()

    // Real shape from the RSVP/checkout flow now:
    // { tickets: RealTicket[], event: {...checkout state...}, buyer: {...}, type: 'free' | 'paid' }
    const state = location.state as {
        tickets?: Array<{
            _id: string;
            code: string;
            attendeeName: string;
            attendeeEmail: string;
            type: 'free' | 'paid';
            price: number;
            event?: string;
        }>;
        event?: {
            eventId: string
            eventName: string
            eventImage: string | null
            eventDateTime: string
            eventVenue: string
            slug: string
        };
        buyer?: { firstName: string; lastName: string; email: string; phoneNumber: string };
        type?: 'free' | 'paid';
    } | null

    const tickets = state?.tickets ?? []
    const eventInfo = state?.event
    const recipientEmail = state?.buyer?.email ?? "your email"

    if (!state || tickets.length === 0 || !eventInfo) {
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

    // Ticket count summary for the confirmation message + calendar/QR display
    const admitsCount = tickets.length

    return (
        <div className='flex flex-col justify-center items-center mx-auto container px-20 pt-10 pb-2 gap-10'>
            <div className='flex justify-center items-center w-full'>
                <ConfirmatoryMessage
                    _id="1"
                    eventName={eventInfo.eventName}
                    orderID={tickets[0]._id}
                    eventDateTime={eventInfo.eventDateTime}
                    ticketDetails={[{ type: "Free", unitPrice: 0, quantity: admitsCount }]}
                    slug={eventInfo.slug}
                />
            </div>
            <div className="w-full space-y-6">
                {tickets.map((t) => (
                    <TicketCard
                        key={t._id}
                        ticket={{
                            _id: t._id,
                            eventName: eventInfo.eventName,
                            category: [],
                            eventDateTime: eventInfo.eventDateTime,
                            eventEntrance: "Main entrance",
                            eventVenue: eventInfo.eventVenue,
                            referenceCode: t.code,
                            orderID: t._id,
                            holderName: t.attendeeName,
                            ticketDetails: [{ type: "Free", unitPrice: 0, quantity: 1 }],
                            qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t.code)}`,
                            refundPolicy: {
                                type: "non-refundable",
                                note: "Free reservations can be cancelled from My Tickets.",
                            },
                        }}
                    />
                ))}
                <p className="mt-5 text-center lg:text-left">A copy has been sent to <span className="font-bold font-grotesk text-lg sm:text-xl break-words">{recipientEmail}</span>. Tickets are also saved to your account.</p>
            </div>
            <div className="flex flex-col sm:flex-row mt-5 mx-5 lg:mx-8 my-8 gap-3 min-[400px]:gap-4 items-center justify-center">
                <div className="flex gap-[27px] min-[400px]:gap-3 sm:gap-7 items-center justify-center">
                    <PaymentBtn
                        icon={calendar}
                        editIcon={"w-[18px] h-[18px]"}
                        text={"Add to calender"}
                        classname="h-[40px] flex-1 sm:w-40 text-xs min-[400px]:text-sm md:w-[343px]"
                        editArrow={"w-[18px] h-[18px]"}
                    />
                    <PaymentBtn
                        text={"View my tickets"}
                        classname="h-[40px] flex-1 sm:w-40 bg-[#0A4F41] text-white hover:bg-[#083b31] hover:text-white text-xs min-[400px]:text-sm md:w-[343px]"
                        editArrow={"w-[18px] h-[18px]"}
                        onClick={() => navigate("/tickets")}
                    />
                </div>
            </div>
        </div>
    )
}

export default TicketConfirmation