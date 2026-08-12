import EventTypeSelector from '@/components/dashboard-create-event/event-type-selector'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import { TYPE_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useCreateEventStep } from "@/components/dashboard-create-event/create-event-sidebar"
import { useState } from 'react'


const EventType = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { control, trigger } = useFormContext<EventFormValues>()
  const [error, setError] = useState(false)
  
  const handleContinue = async () => {
    const valid = await trigger(TYPE_FIELDS)
    if (valid) {
      setError(false)
      navigate("/dashboard/create-event/basics")
    } else {
      setError(true)
    }
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>What kind of events ?</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>This shapes the rest of the set up so pick carefully</p>
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