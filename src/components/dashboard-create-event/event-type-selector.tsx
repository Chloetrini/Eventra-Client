import tickets from '@/assets/tickets.png'
import freestar from '@/assets/freestar.png'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const eventTypes = [
    {
        icon: tickets,
        type: "Paid Event",
        description: "Sell tickets in one or more types. Eventra takes 5% per ticket",
        tag: "paid",
    },
    {
        icon: freestar,
        type: "Free Event",
        description: "Collect RSVPs with a QR ticket. No fees, no payment",
        tag: "free",
    },
]

type EventTypeSelectorProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    error: boolean
}


function EventTypeSelector<T extends FieldValues>({ name, control, error }: EventTypeSelectorProps<T>) {
    const [clicked, setclicked] = useState(false)
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className='w-full'>

                    <div className='flex gap-2'>
                        {eventTypes.map((type) => (
                            <button
                                key={type.tag}
                                className={cn(
                                    'w-full h-[148px] border rounded-[15px] hover:bg-[#E4F1EB] px-[15px] py-[25px] flex flex-col justify-between transition',
                                    field.value === type.tag ? 'bg-[#E4F1EB] border-[#0F6E56]' : ""
                                )}
                                type='button'
                                onClick={() => { field.onChange(type.tag), setclicked(true) }}
                            >
                                <div>
                                    <img src={type.icon} alt="" className='w-[24px] h-[24px]' />
                                </div>
                                <div>
                                    <h5 className='text-[20px] font-bold font-grotesk'>{type.type}</h5>
                                    <p className='text-[13px] text-[#6E6577]'>{type.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {error && !clicked && (
                        <p className='text-red-500 text-sm mt-5'>Select an event type!</p>
                    )}
                </div>
            )}
        />
    )
}

export default EventTypeSelector