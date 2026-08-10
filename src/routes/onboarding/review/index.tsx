import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useNavigate } from "react-router"
import ReviewSummary from "@/components/onboarding/review-summary"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { ONBOARDING_STORAGE_KEY } from "../layout"
import { type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/pageWrapper"

const ReviewPage = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useFormContext<OnboardingValues>()

    // everything the user entered across all three steps arrives here
    // as one object — one request, not three
    const onSubmit = async (values: OnboardingValues) => {
        setIsSubmitting(true)
        try {
            // await submitOnboarding(values)
            console.log("submitting", values)

            // flow is done — don't leave stale draft data behind
            localStorage.removeItem(ONBOARDING_STORAGE_KEY)
            navigate("/onboarding/success")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] '>STEP 3 OF 3</p>
                    <h3 className="font-grotesk font-bold text-[34px]">Review & submit</h3>
                    <p className="font-grotesk font-medium text-[18px] text-[#4A4451] max-w-full md:max-w-[500px] line-clamp-4">
                        We’ll review your details and approve your account, usually within a day. You can start building events right away.
                    </p>
                </div>

                <div className="w-full">
                    <ReviewSummary />
                </div>

                <div className="w-full bg-[#E4F1EB] rounded-[15px]">
                    <div className="flex py-7.5 px-5 items-center gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            {...register("terms")}
                            className="w-5 h-5 accent-[#0F6E56] cursor-pointer"
                        />

                        <label htmlFor="terms">
                            I agree to Eventra’s{" "}
                            <a href="" className="text-[#0F6E56]">
                                Organizer Terms
                            </a>{" "}
                            and{" "}
                            <a href="" className="text-[#0F6E56]">
                                Payout Policy.
                            </a>
                        </label>
                    </div>
                </div>

                <div>
            <PageSwitcher
                backOnClick={() => navigate("/onboarding/bank-account")}
                showSubmit
                submitOnClick={handleSubmit(onSubmit)}
                disableSubmit={!isValid || isSubmitting}
            />
                </div>

            </div>
        </PageWrapper>
    )
}

export default ReviewPage