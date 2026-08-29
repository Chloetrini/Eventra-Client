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
    draftText?: string
    disableDraft?: boolean
    disableSkip?: boolean
    submitText?: string
}

const PageSwitcher = ({ backOnClick, continueOnClick, disableBack, disablecontinue, skipOnClick, showSkip, showSubmit, submitOnClick, disableSubmit, showDraft, draftOnClick, draftText, disableDraft, disableSkip, submitText }: PageSwitcherProps) => {
    return (
        // Every Button (PaymentBtn wraps Button) is whitespace-nowrap and
        // shrink-0 by default — fine on desktop, but with `justify-between`
        // and no wrap, 2-3 of these side by side (Back + Save as draft +
        // Submit for review, say) simply don't fit a narrow screen and push
        // the row wider than the viewport, forcing it to scroll sideways.
        // Stacking to a column below sm and letting each button go full
        // width fixes that without touching desktop at all.
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5'>
            <PaymentBtn
                text="Back"
                icon={ArrowLeft}
                classname='text-[#0F6E56] dark:text-[#4ADE80] font-bold hover:text-white hover:bg-[#0F6E56] w-full sm:w-auto justify-center'
                onClick={backOnClick}
                disabled={disableBack}
            />

            {
                !showSubmit && (
                    <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                        <PaymentBtn
                            text="Skip for now"
                            classname={`text-foreground font-bold w-full sm:w-auto justify-center ${showSkip ? "flex" : "hidden"}`}
                            onClick={skipOnClick}
                            disabled={disableSkip}

                        />

                        <PaymentBtn
                            text="Continue"
                            arrow={ArrowRight}
                            classname='text-[#0F6E56] dark:text-[#4ADE80] font-bold hover:text-white hover:bg-[#0F6E56] w-full sm:w-auto justify-center'
                            onClick={continueOnClick}
                            disabled={disablecontinue}
                        />
                    </div>
                )
            }

            {(showDraft || showSubmit) && (

                <div className='flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto'>
                    {
                        showDraft && (
                            <PaymentBtn
                                text={draftText ?? "Save as draft"}
                                classname={`text-foreground font-bold w-full sm:w-auto justify-center`}
                                onClick={draftOnClick}
                                disabled={disableDraft}
                            />
                        )
                    }
                    {
                        showSubmit && (
                            <PaymentBtn
                                text={submitText ?? "Submit for review"}
                                arrow={ArrowRight}
                                classname='text-[#0F6E56] dark:text-[#4ADE80] font-bold hover:text-white hover:bg-[#0F6E56] w-full sm:w-auto justify-center'
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
