import React from 'react'
import PaymentBtn from '../ui/pay-method-btn'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type PageSwitcherProps = {
    backOnClick?: () => void
    continueOnClick?: () => void
    disableBack?: boolean
    disablecontinue?: boolean
    skipOnClick?: () => void
    showSkip?: boolean
    showSubmit?: boolean
    submitOnClick?: () => void
    disableSubmit?: boolean
}

const PageSwitcher = ({ backOnClick, continueOnClick, disableBack, disablecontinue, skipOnClick, showSkip, showSubmit, submitOnClick, disableSubmit }: PageSwitcherProps) => {
    return (
        <div className='flex justify-between'>
            <PaymentBtn
                text="Back"
                icon={ArrowLeft}
                classname='text-[#0F6E56] font-bold hover:text-white hover:bg-[#0F6E56]'
                onClick={backOnClick}
                disabled={disableBack}
            />

            {
                !showSubmit && (
                    <div className='flex gap-3'>
                        <PaymentBtn
                            text="Skip for now"
                            classname={`text-black font-bold ${showSkip ? "block" : "hidden"}`}
                            onClick={skipOnClick}

                        />

                        <PaymentBtn
                            text="Continue"
                            arrow={ArrowRight}
                            classname='text-[#0F6E56] font-bold hover:text-white hover:bg-[#0F6E56]'
                            onClick={continueOnClick}
                            disabled={disablecontinue}
                        />
                    </div>
                )
            }
            {
                showSubmit && (
                        <PaymentBtn
                            text="Submit for review"
                            arrow={ArrowRight}
                            classname='text-[#0F6E56] font-bold hover:text-white hover:bg-[#0F6E56]'
                            onClick={submitOnClick}
                            disabled={disableSubmit}
                        />
                )
            }
        </div>
    )
}

export default PageSwitcher