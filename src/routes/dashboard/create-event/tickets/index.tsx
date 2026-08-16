import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'
import TicketsForm from '@/components/dashboard-create-event/free-tickets-form'
import PaidTicketsForm from '@/components/dashboard-create-event/paid-tickets-form'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/page-wrapper'
import { RSVP_FIELDS, TICKETS_FIELDS, type EventFormValues } from '@/services/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'

const Tickets = () => {
const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { trigger } = useFormContext<EventFormValues>()

  const handleBack = () => {
    navigate("/dashboard/create-event/location")
  }
  const handleContinue = async () => {
    const isValid = await trigger([...TICKETS_FIELDS])
    if (isValid) navigate("/dashboard/create-event/details")
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Tickets types</h1>
        <p className='font-medium text-[14px] text-muted-foreground'>Add one or more ticket types. Each can have its own price and quantity.</p>
      </div>
      <div className='mt-6 flex flex-col gap-6'>
        <PaidTicketsForm />
      </div>
      <div className='mt-12'>
        <PageSwitcher
          backOnClick={handleBack}
          continueOnClick={handleContinue} />
      </div>
    </PageWrapper>
  )
}

export default Tickets