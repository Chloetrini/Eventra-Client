import { useFormContext, useWatch } from "react-hook-form"
import { useState, useEffect } from "react"
import { FormBox } from "../ui/form-box"
import type { OnboardingValues } from "@/lib/schema"
import user from "@/assets/user.png"
import bankImg from "@/assets/onboarding-bank.png"
import lock from "@/assets/onboarding-lock.png"
import { useListBanks, useResolveBankAccount } from "@/hooks/use-onboarding"
import { CheckCircle2, Loader2 } from "lucide-react"
import { humanizeBankResolveError } from "@/lib/utils"

const BankDetailsForm = () => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<OnboardingValues>()

    const { data: banks = [] } = useListBanks()
    const resolveAccountMutation = useResolveBankAccount()

    const bankNames = banks.map((b) => b.name)

    const [bankName, accountNumber] = useWatch({
        control,
        name: ["bank", "accountNumber"],
    })

    const [verifiedName, setVerifiedName] = useState<string | null>(null)
    const [verifyError, setVerifyError] = useState<string | null>(null)

    useEffect(() => {
        setVerifiedName(null)
        setVerifyError(null)

        const selectedBank = banks.find((b) => b.name === bankName)
        const isValidAccountNumber = accountNumber && accountNumber.length === 10

        if (!selectedBank || !isValidAccountNumber) return

        const timeout = setTimeout(() => {
            resolveAccountMutation.mutate(
                { accountNumber, bankCode: selectedBank.code },
                {
                    onSuccess: (result) => {
                        setVerifiedName(result.accountName)
                        // auto-fill the account holder name field with the verified name
                        setValue("accountHolderName", result.accountName, { shouldValidate: true })
                    },
                    onError: (err) => {
                        setVerifyError(
                            humanizeBankResolveError(
                                err instanceof Error ? err.message : "Couldn't verify this account. Check the details and try again."
                            )
                        )
                    },
                }
            )
        }, 600) // small debounce so it doesn't fire on every keystroke

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bankName, accountNumber, banks, setValue])

    const isVerifying = resolveAccountMutation.isPending

    return (
        <div className="flex flex-col gap-5">
            <span className="h-full w-full relative">
                <img
                    src={user}
                    alt=""
                    className={`w-6 h-6 absolute bottom-5 left-5${errors.accountHolderName ? "bottom-9 left-5" : ""} z-20`}
                />
                <FormBox
                    inputType="input"
                    type="text"
                    label="ACCOUNT HOLDER NAME"
                    placeholder="As it appears on your account"
                    id="accountHolderName"
                    errors={errors.accountHolderName}
                    name="accountHolderName"
                    classname="w-full"
                    borderStyle="onboarding"
                    register={register}
                    disabled={isVerifying}
                />
            </span>
            <div className="flex flex-col md:flex-row gap-[10px]">
                <span className="h-full w-full relative">
                    <img
                        src={bankImg}
                        alt=""
                        className={`w-6 h-6 absolute bottom-5 left-5 ${errors.bank ? "bottom-9 left-5" : ""} z-20`}
                    />
                    <FormBox
                        inputType="select"
                        type="select"
                        label="BANK"
                        placeholder="Select bank"
                        id="bank"
                        errors={errors.bank}
                        name="bank"
                        classname="w-full"
                        borderStyle="onboarding"
                        register={register}
                        control={control}
                        options={bankNames}
                    />
                </span>
                <span className="h-full w-full relative">
                    <img
                        src={lock}
                        alt=""
                        className={`w-6 h-6 absolute bottom-5 left-5 ${errors.accountNumber ? "bottom-9 left-5" : ""} z-20`}
                    />
                    <FormBox
                        inputType="input"
                        type="text"
                        label="ACCOUNT NUMBER"
                        placeholder="10 digits"
                        id="accountNumber"
                        errors={errors.accountNumber}
                        name="accountNumber"
                        classname="w-full"
                        borderStyle="onboarding"
                        register={register}
                    />
                </span>
            </div>

            {isVerifying && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying account…
                </p>
            )}
            {verifiedName && !isVerifying && (
                <p className="flex items-center gap-2 text-sm text-[#0F6E56] dark:text-[#4ADE80] font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified: {verifiedName}
                </p>
            )}
            {verifyError && !isVerifying && (
                <p className="text-sm text-red-600 dark:text-red-400">{verifyError}</p>
            )}
        </div>
    )
}
export default BankDetailsForm
