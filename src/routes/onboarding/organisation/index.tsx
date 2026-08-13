import { useFormContext } from "react-hook-form"
import { useNavigate } from "react-router"
import OrganisationForm from "@/components/onboarding/organisation-form"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { ORGANISATION_FIELDS, type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/pageWrapper"
import { useState } from "react"
import { toast } from "react-toastify"
import { saveOrganizerProfile } from "@/lib/onboarding-api"

const OrganisationPage = () => {
    const navigate = useNavigate()
    const { trigger, getValues } = useFormContext<OnboardingValues>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleContinue = async () => {
        const isValid = await trigger([...ORGANISATION_FIELDS])
        if (!isValid) return

        setIsSubmitting(true)
        try {
            const values = getValues()
            await saveOrganizerProfile({
                businessName: values.organizationName,
                category: values.category,
                city: values.city,
                contactPhone: values.contactPhone,
                publicEmail: values.email,
                bio: values.shortBio,
            })
            navigate("/onboarding/bank-account")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save this step. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
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
                        disableBack={true}
                        continueOnClick={handleContinue}
                        disablecontinue={isSubmitting}
                    />
                </div>
            </div>
        </PageWrapper>
    )
}
export default OrganisationPage