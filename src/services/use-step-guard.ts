import { useFormContext, useWatch } from "react-hook-form"
import { useLocation } from "react-router"
import { stepsFlow } from "@/components/onboarding/sidebar"
import { ORGANISATION_FIELDS, BANK_FIELDS, type OnboardingValues } from "@/services/schema"

/**
 * Shared by the sidebar and the mobile drawer so clicking a step directly
 * obeys the same rule as the Continue button: you can always go back, but
 * jumping ahead re-validates every step in between first.
 */
export const useStepGuard = () => {
    const location = useLocation()
    const { trigger, control } = useFormContext<OnboardingValues>()

    // same "was the bank step ever touched" check the bank page itself uses
    const [accountHolderName, bank, accountNumber] = useWatch({
        control,
        name: [...BANK_FIELDS],
    })
    const bankUntouched = !accountHolderName && !bank && !accountNumber

    const currentIndex = Math.max(
        0,
        stepsFlow.findIndex((s) => s.path === location.pathname)
    )

    const canJumpTo = async (targetIndex: number) => {
        // going back, or clicking the step you're already on, is always fine
        if (targetIndex <= currentIndex) return true

        // walk every step strictly between here and the target
        for (let i = currentIndex; i < targetIndex; i++) {
            if (i === 0) {
                const ok = await trigger([...ORGANISATION_FIELDS])
                if (!ok) return false
            }
            if (i === 1) {
                if (bankUntouched) continue // untouched bank step = legitimately skipped
                const ok = await trigger([...BANK_FIELDS])
                if (!ok) return false
            }
        }
        return true
    }

    return { currentIndex, canJumpTo }
}