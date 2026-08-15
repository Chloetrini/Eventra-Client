import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'
import DetailsForm from '@/components/dashboard-create-event/details-form'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import { DETAILS_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'

const Details = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { control, trigger } = useFormContext<EventFormValues>()
  const eventType = useWatch({ control, name: 'eventType' })

  const handleContinue = async () => {
    const isValid = await trigger([...DETAILS_FIELDS])
    if (isValid) {
      navigate("/dashboard/create-event/review")
    } else {
      console.log("details validation failed")
    }

  }

  const handleBack = () => {
    if (eventType === 'paid') {
      navigate("/dashboard/create-event/tickets")
    } else {
      navigate('/dashboard/create-event/rsvp')
    }
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Optional Details</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>Add only what you need. These sections appear on the event page only when filled.</p>
      </div>

      <div className='mt-6 flex flex-col gap-7'>
        <DetailsForm />
        <PageSwitcher
          continueOnClick={handleContinue}
          backOnClick={handleBack} />
      </div>
    </PageWrapper>
  )
}

export default Details