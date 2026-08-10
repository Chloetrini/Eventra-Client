import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Outlet } from "react-router"
import OnboardingNavbar from "@/components/onboarding/navbar"
import OnboardingSidebar from "@/components/onboarding/sidebar"
import { onboardingSchema, type OnboardingValues } from "@/lib/schema"

export const ONBOARDING_STORAGE_KEY = "eventra-onboarding"

// every field starts as "" (or false) so selects show their placeholder
// and inputs stay controlled from the first render
const emptyValues: OnboardingValues = {
    organizationName: "",
    category: "",
    city: "",
    contactPhone: "",
    email: "",
    shortBio: "",
    accountHolderName: "",
    bank: "",
    accountNumber: "",
    terms: false,
}

const getSavedValues = (): Partial<OnboardingValues> => {
    try {
        const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        // corrupted / unavailable storage shouldn't block onboarding
        return {}
    }
}

const Onboardinglayout = () => {
    /**
     * The ONE form for the whole flow. It lives here because the layout
     * stays mounted while the step pages swap in and out of <Outlet />,
     * so values survive navigation for free.
     */
    const methods = useForm<OnboardingValues>({
        resolver: zodResolver(onboardingSchema),
        mode: "onChange",
        defaultValues: { ...emptyValues, ...getSavedValues() },
    })

    // mirror values into sessionStorage so a refresh (or "Save & exit")
    // doesn't lose progress
    useEffect(() => {
        const subscription = methods.watch((values) => {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(values))
        })
        return () => subscription.unsubscribe()
    }, [methods])

    return (
        <FormProvider {...methods}>
            <div>
                <div>
                    <OnboardingNavbar />
                </div>
                <div className="flex">
                    <OnboardingSidebar />
                    <Outlet />
                </div>
            </div>
        </FormProvider>
    )
}

export default Onboardinglayout