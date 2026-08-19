import EventTypeSelector from '@/components/dashboard-create-event/event-type-selector'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/page-wrapper'
import { TYPE_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useCreateEventStep } from "@/components/dashboard-create-event/create-event-sidebar"
import { useState } from 'react'
import { toast } from 'react-toastify'
import { getCreatedEventId, setCreatedEventId } from '@/lib/create-event-api'
import { useCreateEvent } from '@/hooks/use-create-event'

const EventType = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { control, trigger, getValues } = useFormContext<EventFormValues>()
  const [error, setError] = useState(false)
  const createEvent = useCreateEvent()

  const handleContinue = async () => {
    const valid = await trigger(TYPE_FIELDS)
    if (!valid) {
      setError(true)
      return
    }
    setError(false)

    // If we already have a draft event (e.g. coming back to this step),
    // don't create a duplicate — just move on.
    if (getCreatedEventId()) {
      navigate("/dashboard/create-event/basics")
      return
    }

    try {
      const { eventType } = getValues()
      const created = await createEvent.mutateAsync({ type: eventType })
      // Hold on to the draft's id — every later step PATCHes onto it and
      // Review submits it, so losing this strands the draft server-side.
      setCreatedEventId(created._id)
      navigate("/dashboard/create-event/basics")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start your event. Please try again.")
    }
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>What kind of events ?</h1>
        <p className='font-medium text-[14px] text-muted-foreground'>This shapes the rest of the set up so pick carefully</p>
      </div>
      <div className='mt-6 flex flex-col gap-7'>
        <EventTypeSelector name="eventType" control={control} error={error} />
        <PageSwitcher
          disableBack={true}
          continueOnClick={handleContinue}
        />
      </div>
    </PageWrapper>
  )
}
export default EventType
