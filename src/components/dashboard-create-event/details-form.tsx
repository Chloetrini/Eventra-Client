import type { EventFormValues } from "@/lib/schema"
import { FormBox } from "../ui/form-box"
import { useFormContext, useFieldArray, useWatch, type FieldError } from "react-hook-form"
import { useEffect } from "react"
import ActionBtn from "../ui/action-btn"
import { CircleX } from "lucide-react"
import ImageUploader from "../ui/image-uploader"
import { FieldSuccess } from "../ui/field"


const MAX_ACTS = 10

const DetailsForm = () => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const hasLineup = useWatch({ control, name: 'hasLineup' })
    // const hasGallery = useWatch({ control, name: 'hasGallery' })
    const hasAgePolicy = useWatch({ control, name: 'hasAgePolicy' })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "acts",
    })

    useEffect(() => {
        if (hasLineup && fields.length === 0) {
            append({ name: "", role: "", imageUrl: "" })
        } else if (!hasLineup && fields.length > 0) {
            remove()
        }
    }, [hasLineup, fields.length, append, remove])

    useEffect(() => {
        if (!hasAgePolicy) {
            setValue("policyText", "", { shouldValidate: false, shouldDirty: false })
        }
    }, [hasAgePolicy, setValue])

    const hasRefundPolicy = useWatch({ control, name: 'hasRefundPolicy' })
    const refundDaysBefore = useWatch({ control, name: 'refundDaysBefore' })
    const eventType = useWatch({ control, name: 'eventType' })

    // "hasRefundPolicy" only ever means one thing on this form — refunds
    // allowed up until some number of days before the event — so the
    // policy type is derived from the switch rather than asking the
    // organizer to pick it separately. Turning the switch off clears both
    // the type and the days value, same pattern as hasAgePolicy/policyText above.
    useEffect(() => {
        if (hasRefundPolicy) {
            setValue("refundPolicyType", "refund-until-days-before", { shouldValidate: false, shouldDirty: false })
        } else {
            setValue("refundPolicyType", undefined, { shouldValidate: false, shouldDirty: false })
            setValue("refundDaysBefore", undefined, { shouldValidate: false, shouldDirty: false })
        }
    }, [hasRefundPolicy, setValue])

    // Only counts as "complete" once there's a real, positive number of days
    // — this is what gates the confirmation message below.
    const hasValidRefundDays = Number(refundDaysBefore) > 0


    return (
        <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
                <FormBox
                    inputType='switch'
                    type='switch'
                    id="hasLineup"
                    name="hasLineup"
                    label="Line - Up"
                    switchDescription="Performers of agenda with set times"
                    control={control}
                    register={register}
                    errors={errors.hasLineup}
                    borderStyle='createEvent'
                    switchInputClassName='data-[state=checked]:!bg-[#0F6E56]'
                />

                {hasLineup && (
                    <>
                        {errors.acts?.root?.message && (
                            <p className="text-xs text-destructive">{errors.acts.root.message}</p>
                        )}

                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex gap-5 items-start animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                            >
                                <div className="w-full border border-border p-5 rounded-[20px]">
                                    <FormBox
                                        type="input"
                                        inputType="input"
                                        placeholder="Act/session Name"
                                        id={`acts.${index}.name`}
                                        name={`acts.${index}.name`}
                                        register={register}
                                        errors={errors.acts?.[index]?.name}
                                        classname="w-full"
                                    />
                                    <FormBox
                                        type="input"
                                        inputType="input"
                                        placeholder="Role"
                                        id={`acts.${index}.role`}
                                        name={`acts.${index}.role`}
                                        register={register}
                                        errors={errors.acts?.[index]?.role}
                                        classname="w-full"
                                    />
                                    <FormBox
                                        type="imageUpload"
                                        inputType="imageUpload"
                                        control={control}
                                        placeholder="Upload Photo"
                                        id={`acts.${index}.imageUrl`}
                                        name={`acts.${index}.imageUrl`}
                                        register={register}
                                        errors={errors.acts?.[index]?.imageUrl}
                                        classname="mt-1"
                                        imageVariant="avatar"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <CircleX className={`w-7.5 h-7.5 transition hover:text-red-600`} />
                                </button>
                            </div>
                        ))}

                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                            <ActionBtn
                                text='Add act'
                                type="button"
                                onClick={() => {
                                    if (fields.length < MAX_ACTS) {
                                        append({ name: "", role: "", imageUrl: "" })
                                    }
                                }}
                                disabled={fields.length >= MAX_ACTS}
                                classname="bg-background text-foreground border border-border py-3 px-3.5 hover:text-white h-[46px] w-[119px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>
                    </>
                )}
            </div>
            {/* <div className="flex flex-col gap-4">

                <FormBox
                    inputType='switch'
                    type='switch'
                    id="hasGallery"
                    name="hasGallery"
                    label="Gallery"
                    switchDescription="Extra photos of past edition"
                    control={control}
                    register={register}
                    errors={errors.hasGallery}
                    borderStyle='createEvent'
                />
                {hasGallery && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                        <FormBox
                            inputType='imageUpload'
                            type='text'
                            id="photos"
                            name="photos"
                            errors={errors.photos as FieldError | undefined}
                            control={control}
                            register={register}
                            imagePreviewStyle='h-[527px] rounded-[20px]'
                            imageDefaultStyle='h-[75px] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15'
                            placeholder='Add photos'
                        />
                    </div>
                )}
            </div> */}
            <div className="flex flex-col gap-4">

                <FormBox
                    inputType='switch'
                    type='switch'
                    id="hasAgePolicy"
                    name="hasAgePolicy"
                    label="Age policy"
                    switchDescription="Minimal Age policy"
                    control={control}
                    register={register}
                    errors={errors.hasAgePolicy}
                    borderStyle='createEvent'
                />

                {hasAgePolicy && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                        <FormBox
                            inputType="select"
                            type="select"
                            label="MINIMAL"
                            placeholder="Select age"
                            id="policyText"
                            errors={errors.policyText}
                            name="policyText"
                            classname="w-full"
                            borderStyle="createEvent"
                            register={register}
                            control={control}
                            options={["All Ages", "18+", "21+"]} />

                    </div>
                )}
                {eventType === 'paid' && (
                    <div className="w-full">
                        <FormBox
                            inputType='switch'
                            type='switch'
                            id="hasRefundPolicy"
                            name="hasRefundPolicy"
                            label="Refund Policy"
                            switchDescription="Let attendees request refunds"
                            control={control}
                            register={register}
                            errors={errors.hasRefundPolicy}
                            borderStyle='createEvent'
                            switchInputClassName='data-[state=checked]:!bg-[#0F6E56]'
                        />

                        {hasRefundPolicy && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                                <FormBox
                                    type="number"
                                    inputType="input"
                                    placeholder="Days before the event"
                                    id="refundDaysBefore"
                                    name="refundDaysBefore"
                                    register={register}
                                    errors={errors.refundDaysBefore}
                                    classname="w-full"
                                    minValue={1}
                                />

                                {hasValidRefundDays && (
                                    <FieldSuccess className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                                        Refunds allowed until {refundDaysBefore} day(s) before
                                    </FieldSuccess>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default DetailsForm