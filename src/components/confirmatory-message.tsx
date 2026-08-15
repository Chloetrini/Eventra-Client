import { Check } from 'lucide-react'
import type { TicketCheckout } from '@/lib/dummy-ticket-checkout'
import { formatNaira } from '@/lib/utils'

const ConfirmatoryMessage = ({
    eventName,
    orderID,
    ticketDetails,
    slug
}: TicketCheckout) => {

    const totalTickets = ticketDetails.reduce(
        (total, ticket) => total + ticket.quantity,
        0
    );

    const subTotal = ticketDetails.reduce(
        (sum, ticket) => sum + ticket.unitPrice * ticket.quantity,
        0
    );

    const serviceCharge = 5
    const serviceFee = serviceCharge / 100 * subTotal

    const total = subTotal + serviceFee

    const isFree = total === 0

    return (

        <div className='flex flex-col justify-center items-center gap-1'>
            <div className='w-20 h-20 bg-[#0A4F41] rounded-full flex items-center justify-center'>
                <Check color='white' className='w-10 h-10' />
            </div>
            <p className='text-2xl sm:text-[28px] font-grotesk font-bold'>You’re in!</p>
            <div className='text-center text-muted-foreground'>
                <p>Your {totalTickets}  <span>{totalTickets === 1 ? "ticket" : "tickets"}</span> to <span className='font-semibold hover:underline'><a href={`/events/${slug}`}>{eventName}</a></span> are confirmed.</p>
                <p>ORDER.{orderID} - {isFree ? "" : formatNaira(total)} {isFree ? "FREE" : "PAID"}</p>
            </div>
        </div>
    )
}

export default ConfirmatoryMessage