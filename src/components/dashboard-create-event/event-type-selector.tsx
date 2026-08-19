import tickets from '@/assets/tickets.png'
import freestar from '@/assets/freestar.png'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Link } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { useOrganizerBankStatus, useOrganizerProfileComplete, useOrganizerStatus } from '@/lib/organizer-api'

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
    const { isProfileComplete } = useOrganizerProfileComplete()
    const { bankStatus } = useOrganizerBankStatus();
    const { status } = useOrganizerStatus();

    // Decide what the warning should say (if anything at all):
    // - profile isn't filled out yet -> point them to finish onboarding
    // - profile is fine but bank details aren't -> point them to update bank details
    // - profile + bank are fine but account isn't approved yet -> just warn, no link
    // - all three are fine -> no warning at all
    const onboardingIncomplete = !isProfileComplete
    const bankIncomplete = isProfileComplete && bankStatus !== 'verified'
    const notApproved = isProfileComplete && bankStatus === 'verified' && status !== 'verified'
    const needsAction = onboardingIncomplete || bankIncomplete || notApproved

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className='w-full'>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        {eventTypes.map((type) => (
                            <button
                                key={type.tag}
                                className={cn(
                                    'w-full h-[148px] border border-border rounded-[15px] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 px-[15px] py-[25px] flex flex-col justify-between transition',
                                    field.value === type.tag ? 'bg-[#E4F1EB] dark:bg-[#0F6E56]/15 border-[#0F6E56] dark:border-[#4ADE80]' : ""
                                )}
                                type='button'
                                onClick={() => { field.onChange(type.tag), setclicked(true) }}
                            >
                                <div>
                                    <img src={type.icon} alt="" className='w-[24px] h-[24px]' />
                                </div>
                                <div>
                                    <h5 className='text-[20px] font-bold font-grotesk text-foreground'>{type.type}</h5>
                                    <p className='text-[13px] text-muted-foreground'>{type.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {error && !clicked && (
                        <p className='text-red-500 text-sm mt-5'>Select an event type!</p>
                    )}
                    {/* Free events can go live without any account review — but a paid
                        event can't be submitted until the organizer profile is filled
                        out, bank details are on file, and the account is approved, so
                        warn right here rather than let them build the whole event and
                        hit that wall on the last step. */}
                    {field.value === 'paid' && needsAction && (
                        <div className='mt-5 flex items-start gap-3 rounded-[10px] border border-amber-200 dark:border-amber-800/40 bg-[#F4DFB6]/40 dark:bg-[#7A4E02]/15 px-4 py-3'>
                            <AlertTriangle className='size-4 mt-0.5 shrink-0 text-[#7A4E02] dark:text-[#F5C875]' />
                            <p className='text-[13px] text-[#4A4451] dark:text-white/70'>
                                {onboardingIncomplete
                                    ? "You can't build a paid event until your organizer profile is complete, your bank details are on file and your account has been approved."
                                    : bankIncomplete
                                    ? "You can't build a paid event until your bank details are on file and your account has been approved."
                                    : "You can't build a paid event until your account has been approved."}{' '}
                                {!notApproved && (
                                    <Link to='/dashboard/settings' className='font-semibold text-[#0F6E56] dark:text-[#4ADE80] underline'>
                                        {onboardingIncomplete ? "Finish onboarding" : "Update bank details"}
                                    </Link>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            )}
        />
    )
}

export default EventTypeSelector