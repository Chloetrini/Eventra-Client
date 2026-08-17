import { useFormContext, useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import BankDetailsForm from "@/components/onboarding/bank-details-form"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { BANK_FIELDS, type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/page-wrapper"
import shieldPay from '@/assets/shieldPaywhite.png'
import { useState } from "react"
import { toast } from "react-toastify"
import { saveOrganizerProfile, listBanks } from "@/lib/onboarding-api"

const BankAccountPage = () => {
    const navigate = useNavigate()
    const { control, trigger, resetField, getValues } = useFormContext<OnboardingValues>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [accountHolderName, bank, accountNumber] = useWatch({
        control,
        name: [...BANK_FIELDS],
    })

    const isUntouched = !accountHolderName && !bank && !accountNumber

    const handleContinue = async () => {
        const isValid = await trigger([...BANK_FIELDS])
        if (!isValid) return

        setIsSubmitting(true)
        try {
            const values = getValues()
            const banks = await listBanks()
            const selectedBank = banks.find((b) => b.name === values.bank)

            await saveOrganizerProfile({
                accountNumber: values.accountNumber,
                bankName: values.bank,
                bankCode: selectedBank?.code,
                accountName: values.accountHolderName,
            })
            navigate("/onboarding/review")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save your bank details. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkip = () => {
        BANK_FIELDS.forEach((field) => resetField(field))
        navigate("/onboarding/review")
    }

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] dark:text-[#4ADE80]'>STEP 2 OF 3</p>
                    <h3 className="font-grotesk font-bold text-[34px]">Where should we send your money ?</h3>
                    <p className="font-grotesk font-medium text-[18px] text-muted-foreground max-w-[500px] line-clamp-4">
                        Add the bank account for your payouts; we verify it with paystack. You need this to publish paid events and receive payouts. Free events can go live without it.
                    </p>
                </div>

                <div className="w-full">
                    <BankDetailsForm />
                </div>

                <div className='w-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 rounded-[15px]'>
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
                disablecontinue={isUntouched || isSubmitting}
                showSkip
                skipOnClick={handleSkip}
            />
        </div>
        </PageWrapper>
    )
}

export default BankAccountPage