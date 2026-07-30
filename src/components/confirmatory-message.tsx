import { Check } from 'lucide-react'
import type { TicketCheckout } from '@/lib/dummy-ticket-checkout'
import { formatNaira } from '@/lib/utils'

const ConfirmatoryMessage = ({
   eventName,
   orderID,
//    total 
}: TicketCheckout) => {

    // Rememberr
    const total = formatNaira(100000)
    const ticketNumber = 2

    return (
        
        <div className='flex flex-col justify-center items-center gap-1'>
            <div className='w-20 h-20 bg-[#0A4F41] rounded-full flex items-center justify-center'>
                <Check color='white' className='w-10 h-10' />
            </div>
            <p className='text-2xl sm:text-[28px] font-grotesk font-bold'>You’re in!</p>
            <div className='text-center text-[#4A4451]'>
                <p>Your {ticketNumber} tickets to <span className='font-semibold'>{eventName}</span> are confirmed.</p>
                <p>ORDER.{orderID} - {total} PAID</p>
            </div>
        </div>
    )
}

export default ConfirmatoryMessage