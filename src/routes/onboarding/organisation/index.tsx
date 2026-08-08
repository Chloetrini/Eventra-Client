import { useFormContext } from "react-hook-form"
import { useNavigate } from "react-router"
import OrganisationForm from "@/components/onboarding/organisation-form"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { ORGANISATION_FIELDS, type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/pageWrapper"

const OrganisationPage = () => {
    const navigate = useNavigate()
    const { trigger } = useFormContext<OnboardingValues>()

    const handleContinue = async () => {
        // validates ONLY this step's fields — the bank fields on the next
        // page are still empty and would otherwise block us
        const isValid = await trigger([...ORGANISATION_FIELDS])
        if (isValid) navigate("/onboarding/bank-account")
    }

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] '>STEP 1 OF 3</p>
                    <h3 className="font-grotesk font-bold text-[34px]">About your organization</h3>
                    <p className="font-grotesk font-medium text-[18px] text-[#4A4451]">This is what attendees see on your events and profile.</p>
                </div>

                <div className="w-full">
                    <OrganisationForm />
                </div>
                <div>
                    <PageSwitcher
                        backOnClick={() => navigate(-1)}
                        continueOnClick={handleContinue}
                    />
                </div>

            </div>
        </PageWrapper>
    )
}

export default OrganisationPage