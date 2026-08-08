import { useFormContext, useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import BankDetailsForm from "@/components/onboarding/bank-details-form"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { BANK_FIELDS, type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/pageWrapper"
import shieldPay from '@/assets/shieldPaywhite.png'

const BankAccountPage = () => {
    const navigate = useNavigate()
    const { control, trigger, resetField } = useFormContext<OnboardingValues>()

    // useWatch, not watch — watch() subscribes at the root (the layout),
    // so it won't re-render this page behind <Outlet />
    const [accountHolderName, bank, accountNumber] = useWatch({
        control,
        name: [...BANK_FIELDS],
    })

    // nothing typed yet? then there's nothing to validate or save —
    // Continue would just be Skip, so we point them at Skip instead
    const isUntouched = !accountHolderName && !bank && !accountNumber

    const handleContinue = async () => {
        const isValid = await trigger([...BANK_FIELDS])
        if (isValid) navigate("/onboarding/review")
    }

    const handleSkip = () => {
        // clear any half-typed values so the review page and the schema's
        // "all or nothing" rule both see a cleanly skipped step
        BANK_FIELDS.forEach((field) => resetField(field))
        navigate("/onboarding/review")
    }

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] '>STEP 2 OF 3</p>
                    <h3 className="font-grotesk font-bold text-[34px]">Where should we send your money ?</h3>
                    <p className="font-grotesk font-medium text-[18px] text-[#4A4451] max-w-[500px] line-clamp-4">
                        Add the bank account for your payouts; we verify it with paystack. You need this to publish paid events and receive payouts. Free events can go live without it.
                    </p>
                </div>

                <div className="w-full">
                    <BankDetailsForm />
                </div>

                <div className='w-full bg-[#E4F1EB] rounded-[15px]'>
                    <div className='flex py-7.5 px-5 items-center gap-3'>
                        <img src={shieldPay} alt="" className='w-7.5 h-7.5' />
                        <p className='flex flex-col'>
                            <span>We use Paystack to confirm your account name.</span>
                            <span>Payouts land a few days after each event.</span>
                        </p>
                    </div>
                </div>

            <PageSwitcher
                backOnClick={() => navigate("/onboarding/organisation")}
                continueOnClick={handleContinue}
                disablecontinue={isUntouched}
                showSkip
                skipOnClick={handleSkip}
            />
        </div>
        </PageWrapper>
    )
}

export default BankAccountPage