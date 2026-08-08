import EventTypeSelector from '@/components/dashboard-create-event/event-type-selector'
import PageWrapper from '@/components/pageWrapper'
import React from 'react'

const EventType = () => {
  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP 1 OF 8</p>
        <h1 className='text-[28px] font-bold font-grotesk'>What kind of events ?</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>This shapes the rest of the set up so pick carefully</p>
      </div>

      <div className='mt-6'>
        <EventTypeSelector/>
      </div>
    </PageWrapper>
  )
}

export default EventType