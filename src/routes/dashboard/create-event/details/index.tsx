import PageWrapper from '@/components/pageWrapper'

const index = () => {
  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56]'>STEP 5 OF 8</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Optional Details</h1>
        <p className='font-medium text-[14px] text-[#4A4451]'>Add only what you need. These sections appear on the event page only when filled.</p>
      </div>

      <div className='mt-6'>
        {/* <BasicsForm /> */}
      </div>
    </PageWrapper>
  )
}

export default index