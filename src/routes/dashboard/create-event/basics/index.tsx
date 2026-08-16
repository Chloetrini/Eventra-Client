import BasicsForm from '@/components/dashboard-create-event/basics-form'
import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'
import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/page-wrapper'
import { BASICS_FIELDS, type EventFormValues } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { toast } from 'react-toastify'


const Basics = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const { trigger, getValues } = useFormContext<EventFormValues>()
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleBack = () => {
    navigate("/dashboard/create-event")
  }

  const handleContinue = async () => {
    const isValid = await trigger([...BASICS_FIELDS])
    if (!isValid) return;


    // const eventId = getCreatedEventId()
    // if (!eventId) {
    //   toast.error("Something went wrong — please start over from Step 1.")
    //   navigate("/dashboard/create-event")
    //   return
    // }

    try {
      const values = getValues()

      const eventDatePart = values.date?.split("T")[0]
      const startTimePart = values.startTime?.split("T")[1]
      const endTimePart = values.endTime?.split("T")[1]

      const startDateTime = eventDatePart && startTimePart
        ? new Date(`${eventDatePart}T${startTimePart}`).toISOString()
        : undefined

      const endDateTime = eventDatePart && endTimePart
        ? new Date(`${eventDatePart}T${endTimePart}`).toISOString()
        : undefined

      // await updateEvent(eventId, {
      //   title: values.eventName,
      //   category: values.category,
      //   startDate: startDateTime,
      //   endDate: endDateTime,
      //   description: values.description,
      //   coverImage: values.coverImage || undefined,
      // })

      navigate("/dashboard/create-event/location")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save this step. Please try again.")
    } 
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Basics</h1>
        <p className='font-medium text-[14px] text-muted-foreground'>Give your events name and essentials</p>
      </div>
      <div className='mt-6 flex flex-col gap-8'>
        <BasicsForm onUploadStatusChange={setIsUploadingImage} />
        <PageSwitcher
          backOnClick={handleBack}
          continueOnClick={handleContinue}
        />
        {isUploadingImage && (
          <p className="text-sm text-[#0F6E56] font-medium -mt-4">
            Please wait for your image to finish uploading…
          </p>
        )}
      </div>
    </PageWrapper>
  )
}
export default Basics