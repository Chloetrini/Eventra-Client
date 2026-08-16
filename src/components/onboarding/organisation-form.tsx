import { useEffect, useState } from "react"
import { FormBox } from "@/components/ui/form-box"
import { useFormContext } from "react-hook-form"
import { nigerianStates } from "@/lib/constants"
import type { OnboardingValues } from "@/lib/schema"
import { fetchCategories, type EventCategory } from "@/lib/create-event-api"
import city from "@/assets/city.png"
import Tag from "@/assets/Tag.png"
import location from "@/assets/location.png"
import call from "@/assets/call.png"
import email from "@/assets/email.png"
import pencil from "@/assets/pencil.png"

const OrganisationForm = () => {
    // same form instance as the layout — no local useForm here
    const {
        register,
        formState: { errors },
    } = useFormContext<OnboardingValues>()

    const [categories, setCategories] = useState<EventCategory[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [categoriesError, setCategoriesError] = useState(false)

    useEffect(() => {
        let cancelled = false
        fetchCategories()
            .then((data) => {
                if (!cancelled) setCategories(data)
            })
            .catch(() => {
                if (!cancelled) setCategoriesError(true)
            })
            .finally(() => {
                if (!cancelled) setCategoriesLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const categoryOptions = categories.map((category) => category.name)

    return (
        <div>
            <div className="flex flex-col gap-5">
                <span className="h-full w-full relative">
                    <img
                        src={city}
                        alt=""
                        className={`w-6 h-6 absolute bottom-5 left-5 ${errors.organizationName ? "bottom-9 left-5" : ""} z-20`}
                    />
                    <FormBox
                        inputType="input"
                        type="text"
                        label="ORGANIZATION NAME"
                        placeholder="Lagos Live Co."
                        id="organizationName"
                        errors={errors.organizationName}
                        name="organizationName"
                        classname="w-full"
                        borderStyle="onboarding"
                        register={register}
                    />
                </span>

                <div className="flex flex-col md:flex-row gap-[10px]">
                    <span className="h-full w-full relative">
                        <img
                            src={Tag}
                            alt=""
                            className={`w-6 h-6 absolute bottom-5 left-5 ${errors.category ? "bottom-9 left-5" : ""} z-20`}
                        />
                        <FormBox
                            inputType="select"
                            type="select"
                            label="CATEGORY"
                            placeholder={
                                categoriesLoading
                                    ? "Loading categories…"
                                    : categoriesError
                                    ? "Couldn't load categories"
                                    : "Select category"
                            }
                            id="category"
                            errors={errors.category}
                            name="category"
                            classname="w-full"
                            borderStyle="onboarding"
                            register={register}
                            options={categoryOptions}
                            disabled={categoriesLoading || categoriesError}
                        />
                        {categoriesError && (
                            <p className="text-xs text-destructive mt-1">
                                Couldn't load categories. Refresh the page to try again.
                            </p>
                        )}
                    </span>

                    <span className="h-full w-full relative">
                        <img
                            src={location}
                            alt=""
                            className={`w-6 h-6 absolute bottom-5 left-5 ${errors.city ? "bottom-9 left-5" : ""} z-20`}
                        />
                        <FormBox
                            inputType="select"
                            type="select"
                            label="CITY"
                            placeholder="Select city"
                            id="city"
                            errors={errors.city}
                            name="city"
                            classname="w-full z-0"
                            borderStyle="onboarding"
                            register={register}
                            options={nigerianStates}
                        />
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-[10px]">
                    <span className="h-full w-full relative">
                        <img
                            src={call}
                            alt=""
                            className={`w-6 h-6 absolute bottom-5 left-5 ${errors.contactPhone ? "bottom-9 left-5" : ""} z-20`}
                        />
                        <FormBox
                            inputType="input"
                            type="tel"
                            label="CONTACT PHONE"
                            placeholder="+234 800 000 0000"
                            id="contactPhone"
                            errors={errors.contactPhone}
                            name="contactPhone"
                            classname="w-ful z-0"
                            borderStyle="onboarding"
                            register={register}
                        />
                    </span>

                    <span className="h-full w-full relative">
                        <img
                            src={email}
                            alt=""
                            className={`w-6 h-6 absolute bottom-5 left-5 ${errors.email ? "bottom-9 left-5" : ""} z-20`}
                        />
                        <FormBox
                            inputType="input"
                            type="email"
                            label="PUBLIC EMAIL"
                            placeholder="hello@lagoslive.ng"
                            id="email"
                            errors={errors.email}
                            name="email"
                            classname="w-full"
                            borderStyle="onboarding"
                            register={register}
                        />
                    </span>
                </div>

                <span className="h-full w-full relative">
                    <img
                        src={pencil}
                        alt=""
                        className={`w-6 h-6 absolute bottom-5 left-5 ${errors.shortBio ? "bottom-9 left-5" : ""} z-20`}
                    />
                    <FormBox
                        inputType="textarea"
                        type="textarea"
                        label="SHORT BIO"
                        placeholder="Lagos's home for unforgettable live music."
                        id="shortBio"
                        errors={errors.shortBio}
                        name="shortBio"
                        classname="w-full "
                        borderStyle="onboarding"
                        register={register}
                    />
                </span>
            </div>
        </div>
    )
}

export default OrganisationForm