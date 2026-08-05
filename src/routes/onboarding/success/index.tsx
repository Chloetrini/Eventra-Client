import successTick from '@/assets/successTick.png'
import PageWrapper from '@/components/pageWrapper'
import PaymentBtn from '@/components/ui/pay-method-btn'
import { ArrowRight } from 'lucide-react'

const OnboardingSuccess = () => {
    return (
        <PageWrapper className='w-full px-2 pt-10 md:pt-20 md:px-0'>
            <div className="flex flex-col gap-7 justify-center items-center w-full">
                <div>
                    <img src={successTick} alt="" className='w-[230px] h-[180px]' />
                </div>

                <h1 className='font-grotesk font-bold text-[34px]'>You’re all set!</h1>

                <p className='font-grotesk line-clamp-4 md:max-w-[550px] font-medium text-center md:text-start'>Your organizer account is created and your details are <a href="" className='text-[#0F6E56]'>under review.</a> Start creating events now, free events can go live immediately, and paid events unlock once you’re verified. </p>

                <PaymentBtn
                text="Go to dashboard"
                arrow={ArrowRight}
                classname='text-white font-bold bg-[#0F6E56] hover:bg-[#095341] hover:text-white'
                />

            </div>
        </PageWrapper>
    )
}

export default OnboardingSuccess