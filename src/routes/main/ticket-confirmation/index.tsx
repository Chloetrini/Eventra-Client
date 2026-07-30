import ConfirmatoryMessage from "@/components/confirmatory-message"
import TicketComponent from "@/components/ticket"
import { getTicketById } from "@/lib/dummy-ticket"
import { getEventById } from "@/lib/dummy-ticket-checkout"
import { useQuery } from "@tanstack/react-query"
import { data, useParams } from "react-router"


const TicketConfirmation = () => {

    // const { id } = useParams<{ id: string }>()
    const id = "1"

    const { data: ticket, isLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getTicketById(id!),
        enabled: !!id,
    })

    const recipientEmail = "oghenekevwet@gmail.com"

    if (isLoading) return <div className='w-full'>Loading…</div>
    if (isError || !ticket) return <div className='w-full'>Event not found.</div>

    return (
        <div className='flex flex-col justify-center items-center mx-auto container px-4 sm:px-8 lg:px-20 pt-10 pb-2 gap-10'>

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
                <TicketComponent
                    ticket={ticket}
                />

                <p className="mt-5 text-center lg:text-left">A copy has been sent to <span className="font-bold font-grotesk text-lg sm:text-xl break-words">{recipientEmail}</span>. Tickets are also saved to your account.</p>

            </div>

        </div>
    )
}

export default TicketConfirmation