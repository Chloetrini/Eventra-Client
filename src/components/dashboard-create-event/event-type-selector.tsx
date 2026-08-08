import tickets from '@/assets/tickets.png'
import freestar from '@/assets/freestar.png'


const eventTypes = [
    {
        icon: tickets,
        type: "Paid Event",
        description: "Sell tickets in one or more types. Eventra takes 5% per ticket"
    },
    {
        icon: freestar,
        type: "Free Event",
        description: "Collect RSVPs with a QR ticket. No fees, no payment"
    },
]

const EventTypeSelector = () => {



  return (
    <div className='flex gap-2'>
        {eventTypes.map((type) => (
        <div className='w-[396px] h-[148px] border rounded-[15px] hover:bg-[#E4F1EB] px-[15px] py-[25px] flex flex-col justify-between'>
            <div>
                <img src={type.icon} alt="" className='w-[24px] h-[24px]'/>
            </div>
            <div>
                <h5 className='text-[20px] font-bold font-grotesk'>{type.type}</h5>
                <p className='text-[13px] text-[#6E6577]'>{type.description}</p>
            </div>
        </div>
        ))}
    </div>
  )
}

export default EventTypeSelector