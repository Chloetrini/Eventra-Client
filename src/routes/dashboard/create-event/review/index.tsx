import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import type { EventFormValues } from '@/lib/schema'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { CREATE_EVENT_STORAGE_KEY } from '../layout'
import EventReview from '@/components/dashboard-create-event/event-review'
import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'

const Review = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useFormContext<EventFormValues>()

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true)
    try {
      // await submitOnboarding(values)
      console.log("submitting", values)

      // flow is done — don't leave stale draft data behind
      localStorage.removeItem(CREATE_EVENT_STORAGE_KEY)
      navigate("/dashboard/overview")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Review & publish</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>All events are reviewed by our team before going live</p>
      </div>
      <div className='mt-6 mb-9'>
        <EventReview />
      </div>
      <div>
        <PageSwitcher
          backOnClick={() => navigate("/create-event/details")}
          showDraft
          showSubmit
          submitOnClick={handleSubmit(onSubmit)}
          disableSubmit={!isValid || isSubmitting} />
      </div>
    </PageWrapper>
  )
}

export default Review