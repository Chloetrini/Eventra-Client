import { useFormContext } from "react-hook-form"
import ngBanks from "ng-banks"
import { FormBox } from "../ui/form-box"
import type { OnboardingValues } from "@/lib/schema"
import user from "@/assets/user.png"
import bankImg from "@/assets/onboarding-bank.png"
import lock from "@/assets/onboarding-lock.png"

const BankDetailsForm = () => {
    // same form instance as the layout — no local useForm here
    const {
        register,
        formState: { errors },
    } = useFormContext<OnboardingValues>()

    const banks = ngBanks.getBanks() ?? []
    const bankNames: string[] = banks.map((bank) => bank.name)

    return (
        <div className="flex flex-col gap-5">
            <span className="h-full w-full relative">
                <img
                    src={user}
                    alt=""
                    className={`w-6 h-6 absolute bottom-5 left-5 ${errors.accountHolderName ? "bottom-9 left-5" : ""} z-20`}
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
                        // was mislabelled "BANK"
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
        </div>
    )
}

export default BankDetailsForm