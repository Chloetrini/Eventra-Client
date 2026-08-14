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
    showDraft?: boolean
    draftOnClick?: () => void
    disableSkip?: boolean
}

const PageSwitcher = ({ backOnClick, continueOnClick, disableBack, disablecontinue, skipOnClick, showSkip, showSubmit, submitOnClick, disableSubmit, showDraft, draftOnClick, disableSkip }: PageSwitcherProps) => {
    return (
        <div className='flex justify-between mb-5'>
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
                            disabled={disableSkip}

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

            {(showDraft || showSubmit) && (

                <div className='flex items-center gap-5'>
                    {
                        showDraft && (
                            <PaymentBtn
                                text="Save as draft"
                                classname={`text-black font-bold`}
                                onClick={skipOnClick}

                            />
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
            )}
        </div>
    )
}

export default PageSwitcher