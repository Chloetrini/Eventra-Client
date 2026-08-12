import type { EventFormValues } from "@/lib/schema"
import { FormBox } from "../ui/form-box"
import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import ActionBtn from "../ui/action-btn"
import { CircleX } from "lucide-react"
import ImageUploader from "../ui/image-uploader"
import { FieldSuccess } from "../ui/field" // adjust path to wherever you place it


const MAX_ACTS = 10

const DetailsForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const hasLineup = useWatch({ control, name: 'hasLineup' })
    const hasGallery = useWatch({ control, name: 'hasGallery' })
    const hasAgePolicy = useWatch({ control, name: 'hasAgePolicy' })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "acts",
    })

    const hasRefundPolicy = useWatch({ control, name: 'hasRefundPolicy' })
    const eventType = useWatch({ control, name: 'eventType' })


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
                                className="flex gap-5 items-center animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                            >
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
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <CircleX className="w-7.5 h-7.5 hover:text-red-600 transition" />
                                </button>
                            </div>
                        ))}

                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                            <ActionBtn
                                text='Add act'
                                type="button"
                                onClick={() => {
                                    if (fields.length < MAX_ACTS) {
                                        append({ name: "" })
                                    }
                                }}
                                disabled={fields.length >= MAX_ACTS}
                                classname="bg-white text-black border-[#E8E6E0] py-3 px-3.5 hover:text-white h-[46px] w-[119px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-4">

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
                            // errors={errors.photos}
                            control={control}
                            register={register}
                            imagePreviewStyle='h-[527px] rounded-[20px]'
                            imageDefaultStyle='h-[75px] hover:bg-[#E4F1EB]'
                            placeholder='Add photos'
                        />
                    </div>
                )}
            </div>
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
                            <FieldSuccess className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                                Refunds allowed until 3 days before
                            </FieldSuccess>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default DetailsForm