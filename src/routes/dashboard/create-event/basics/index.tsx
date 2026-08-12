import BasicsForm from '@/components/dashboard-create-event/basics-form'
import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import { BASICS_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'


const Basics = () => {
const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { trigger } = useFormContext<EventFormValues>()


  const handleBack = () => {
    navigate("/dashboard/create-event")
  }
  const handleContinue = async () => {
    const isValid = await trigger([...BASICS_FIELDS])
    if (isValid) navigate("/dashboard/create-event/location")
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Basics</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>Give your events name and essentials</p>
      </div>

      <div className='mt-6 flex flex-col gap-8'>
        <BasicsForm />
        <PageSwitcher
          backOnClick={handleBack}
          continueOnClick={handleContinue} />


      </div>
    </PageWrapper>
  )
}

export default Basics