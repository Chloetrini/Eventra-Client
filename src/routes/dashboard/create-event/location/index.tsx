import LocationForm from '@/components/dashboard-create-event/location-form'
import LocationSelector from '@/components/dashboard-create-event/location-selector'
import MapPreview from '@/components/dashboard-create-event/map-preview'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import { useFormContext } from 'react-hook-form'
import { LOCATION_FIELDS, type EventFormValues } from '@/lib/schema'
import { useNavigate } from 'react-router'
import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'

const Location = () => {
    const { currentStep, totalSteps } = useCreateEventStep()
    const { control, trigger, getValues } = useFormContext<EventFormValues>()
    const navigate = useNavigate()


    const handleBack = () => {
        navigate("/dashboard/create-event/basics")
    }
    const handleContinue = async () => {
        const isValid = await trigger([...LOCATION_FIELDS])
            const eventType = getValues('eventType')
        if (isValid) navigate(eventType === 'paid' ? '/dashboard/create-event/tickets' : '/dashboard/create-event/rsvp')
    }
    return (
        <PageWrapper className='pl-[16px] pr-[34px]'>
            <div>
                <p className='font-space text-[13px] text-[#0F6E56]'>STEP {currentStep} OF {totalSteps}</p>
                <h1 className='text-[28px] font-bold font-grotesk'>Where is it?</h1>
                <p className='font-medium text-[14px] text-[#4A4451]'>A physical venue or an online event.</p>
            </div>
            <div className='mt-6 flex flex-col gap-6'>
                <LocationSelector name="locationType" control={control} />
                <LocationForm />
                <MapPreview />
            </div>
            <div>
                <PageSwitcher
                    backOnClick={handleBack}
                    continueOnClick={handleContinue} />
            </div>
        </PageWrapper>
    )
}

export default Location