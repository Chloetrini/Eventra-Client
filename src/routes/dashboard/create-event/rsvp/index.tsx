import FreeTicketsForm from '@/components/dashboard-create-event/free-tickets-form'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/page-wrapper'
import { RSVP_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useCreateEventStep } from "@/components/dashboard-create-event/create-event-sidebar"


const Tickets = () => {
const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { trigger } = useFormContext<EventFormValues>()

  const handleBack = () => {
    navigate("/dashboard/create-event/location")
  }
  const handleContinue = async () => {
    const isValid = await trigger([...RSVP_FIELDS])
    if (isValid) navigate("/dashboard/create-event/details")
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>RSVP & Capacity</h1>
        <p className='font-medium text-[14px] text-muted-foreground'>Free events collect RSVPs. Set a capacity if the venue is limited.</p>
      </div>
      <div className='mt-6 flex flex-col gap-6'>
        <FreeTicketsForm />
        <div className='w-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 p-2.5 rounded-[5px]'>
          <p className='text-[14px] text-muted-foreground'>Attendees reserve a free spot and get a QR ticket. Leave capacity off for unlimited.</p>
        </div>
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