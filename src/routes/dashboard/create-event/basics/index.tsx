import BasicsForm from '@/components/dashboard-create-event/basics-form'
import PageWrapper from '@/components/pageWrapper'
import React from 'react'

const Basics = () => {
  return (
        <PageWrapper className='pl-[16px] pr-[34px]'>
          <div>
            <p className='font-space text-[13px] text-[#0F6E56]'>STEP 2 OF 8</p>
            <h1 className='text-[28px] font-bold font-grotesk'>Basics</h1>
            <p className='font-medium text-[14px] text-[#4A4451]'>Give your events name and essentials</p>
          </div>
    
          <div className='mt-6'>
            <BasicsForm/>
          </div>
        </PageWrapper>
  )
}

export default Basics