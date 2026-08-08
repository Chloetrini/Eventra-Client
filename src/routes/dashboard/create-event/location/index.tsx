import LocationSelector from '@/components/dashboard-create-event/location-selector'
import PageWrapper from '@/components/pageWrapper'
import React from 'react'

const location = () => {
    return (
        <PageWrapper className='pl-[16px] pr-[34px]'>
            <div>
                <p className='font-space text-[13px] text-[#0F6E56]'>STEP 3 OF 8</p>
                <h1 className='text-[28px] font-bold font-grotesk'>Where is it?</h1>
                <p className='font-medium text-[14px] text-[#4A4451]'>A physical venue or an online event.</p>
            </div>

            <div className='mt-6'>
                <LocationSelector/>
            </div>
        </PageWrapper>
    )
}

export default location