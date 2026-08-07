import React from 'react'
import { formatDateTime, formatNaira } from '@/lib/utils'
import { CalendarDays, MapPin } from 'lucide-react'
import PaymentBtn from './ui/pay-method-btn'
import lock from '@/assets/lock.png'
import yellowLock from '@/assets/yellow lock.png'
import { Separator } from './ui/separator'


interface TicketPreviewProps {
  ticketCheckout: {
    eventName: string
    eventImage: string | null
    eventDateTime: string
    eventVenue: string
    ticketDetails: { type: string; unitPrice: number; quantity: number }[]
  }
  onPay?: () => void
}

const TicketPreview = ({ ticketCheckout, onPay }: TicketPreviewProps) => {

  const subTotal = ticketCheckout.ticketDetails.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  const serviceCharge = 5
  const serviceFee = serviceCharge / 100 * subTotal

  const total = subTotal + serviceFee

  const isFree = total === 0

  return (
    <div className='flex flex-col w-full'>
      <div >
        {ticketCheckout.eventImage && (

          <img src={ticketCheckout.eventImage} alt={ticketCheckout.eventName} className='w-full rounded-t-2xl h-[130px] object-cover' />


        )}
      </div>
      <div className='flex flex-col gap-5 px-5 py-5 shadow-2xl rounded-b-2xl'>

        <div>
          <p className='font-semibold font-grotesk mb-1 text-lg'>{ticketCheckout.eventName}</p>
          <p className='flex flex-wrap gap-x-5 gap-y-1 text-sm'>
            <span className='flex items-center gap-1'>
              <CalendarDays size={15} color='#8E8E93' />{formatDateTime(ticketCheckout.eventDateTime, "EEE, PP - p")}
            </span>
            <span className='flex items-center gap-1'>
              <MapPin size={15} color='#8E8E93' />
              {ticketCheckout.eventVenue}
            </span>
          </p>
        </div>
        <div className='border-t pt-2'>
          <div>
            {ticketCheckout.ticketDetails.map((ticketDetails, id) => (
              <div key={id} className='flex justify-between leading-10 items-center'>

                {!isFree && (

                  <p className='text-sm'>
                    {ticketDetails.type} x{ticketDetails.quantity}
                  </p>
                )}
                {!isFree && (
                  <p className='font-space font-bold'>
                    {formatNaira(ticketDetails.unitPrice * ticketDetails.quantity)}
                  </p>
                )}

                {isFree && (

                  <div className='w-full border-b pb-2 mb-3'>

                    <div className='flex justify-between items-center w-full'>
                      <p className='text-sm'>{ticketDetails.type} Ticket</p>
                      <p className='font-space font-bold'>{ticketDetails.quantity}</p>
                    </div>

                  </div>
                )}


              </div>
            ))}
            {!isFree && (
              <div className='flex justify-between border-b pb-2'>
                <p className='text-sm'>
                  Service fee ({serviceCharge}%)
                </p>
                <p className='font-space font-bold'>
                  {formatNaira(serviceFee)}
                </p>
              </div>
            )}
          </div>
          <div className='flex justify-between'>
            <p className='font-grotesk font-bold'>
              Total
            </p>
            <p className='font-space font-bold'>
              {total ? formatNaira(total) : "Free"}
            </p>
          </div>
        </div>
        {isFree ? (
          <PaymentBtn
            classname='bg-[#0A4F41] hover:bg-[#083b31] text-white hover:text-white h-11.5'
            text="Reserve Ticket"
            icon={lock}
            editIcon='w-4 h-4'
            onClick={onPay}
          />
        ) : (
          <PaymentBtn
            classname='bg-[#0A4F41] hover:bg-[#083b31] text-white hover:text-white h-11.5'
            text={`Pay ${formatNaira(total)}`}
            icon={lock}
            editIcon='w-4 h-4'
            onClick={onPay}
          />
        )}
        <p className='text-xs flex justify-center md:items-center gap-0.5 md:gap-1 mt-[-15px] text-center md:text-start'>
          <span><img src={yellowLock} alt="" className='w-3 h-3' /></span>
          Secured by Paystack - Money held until the event</p>
      </div>
    </div>
  )
}

export default TicketPreview