import { useFormContext } from "react-hook-form"
import { useNavigate } from "react-router"
import ReviewSummary from "@/components/onboarding/review-summary"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { ONBOARDING_STORAGE_KEY } from "../layout"
import { type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/page-wrapper"
import { toast } from "react-toastify"
import { useSubmitOrganizerProfileForReview } from "@/hooks/use-onboarding"

const ReviewPage = () => {
    const navigate = useNavigate()
    const submitForReviewMutation = useSubmitOrganizerProfileForReview()

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useFormContext<OnboardingValues>()

    // All the fields were already saved incrementally at each step —
    // this final submit just flips the profile to "pending review".
    const onSubmit = async (values: OnboardingValues) => {
    try {
        await submitForReviewMutation.mutateAsync({ agreedToTerms: values.terms })
        localStorage.removeItem(ONBOARDING_STORAGE_KEY)
        navigate("/onboarding/success")
    } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not submit for review. Please try again.")
    }
}

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] dark:text-[#4ADE80]'>STEP 4 OF 4</p>
                    <h3 className="font-grotesk font-bold text-[34px]">Review & submit</h3>
                    <p className="font-grotesk font-medium text-[18px] text-muted-foreground max-w-full md:max-w-[500px] line-clamp-4">
                        We'll review your details and approve your account, usually within a day. You can start building events right away.
                    </p>
                </div>

                <div className="w-full">
                    <ReviewSummary />
                </div>

                <div className="w-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 rounded-[15px]">
                    <div className="flex py-7.5 px-5 items-center gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            {...register("terms")}
                            className="w-5 h-5 accent-[#0F6E56] cursor-pointer"
                        />

                        <label htmlFor="terms">
                            I agree to Eventra's{" "}
                            <a href="" className="text-[#0F6E56] dark:text-[#4ADE80]">
                                Organizer Terms
                            </a>{" "}
                            and{" "}
                            <a href="" className="text-[#0F6E56] dark:text-[#4ADE80]">
                                Payout Policy.
                            </a>
                        </label>
                    </div>
                </div>

                <div>
            <PageSwitcher
                backOnClick={() => navigate("/onboarding/verification")}
                showSubmit
                submitOnClick={handleSubmit(onSubmit)}
                disableSubmit={!isValid || submitForReviewMutation.isPending}
            />
                </div>

            </div>
        </PageWrapper>
    )
}

export default ReviewPage
