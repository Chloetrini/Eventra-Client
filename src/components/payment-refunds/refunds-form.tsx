import type { RefundsValues } from "@/lib/schema"
import { useFormContext, useFieldArray, useFormState } from "react-hook-form"
import { FormBox } from "../ui/form-box"
import ActionBtn from "../ui/action-btn"
import { CircleX } from "lucide-react"
import { FieldError } from "../ui/field"

const RefundsForm = () => {
    const { register, control } = useFormContext<RefundsValues>()
    const { errors } = useFormState({ control })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "evidence",
    })

    return (
        <div className="flex flex-col gap-5">
            <FormBox
                inputType="select"
                type="select"
                label="REASON FOR REQUEST"
                placeholder="Select a reason"
                id="reason"
                name="reason"
                errors={errors.reason}
                register={register}
                control={control}
                options={[
                    "I was charged but did not receive my ticket",
                    "I was charged multiple times",
                    "The event was cancelled",
                    "The event was postponed",
                    "I could not attend the event",
                    "My ticket was not accepted",
                    "The event did not match the description",
                    "Other",
                ]}
                classname="w-full"
                borderStyle="createEvent"
            />

            <FormBox
                inputType="textarea"
                type="textarea"
                label="WHAT HAPPENED?"
                placeholder="Please explain what happened and why you believe you should receive a refund..."
                id="description"
                name="description"
                errors={errors.description}
                classname="w-full"
                borderStyle="createEvent"
                register={register}
            />

            <FormBox
                inputType="select"
                type="select"
                label="REQUESTED RESOLUTION"
                placeholder="What would you like us to do?"
                id="requestedResolution"
                name="requestedResolution"
                errors={errors.requestedResolution}
                register={register}
                control={control}
                options={[
                    "Full refund",
                    "Partial refund",
                    "Ticket replacement",
                    "Other",
                ]}
                classname="w-full"
                borderStyle="createEvent"
            />

            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-sm font-medium">EVIDENCE</p>
                    <p className="text-xs text-muted-foreground mt-1 ">
                        Upload screenshots or other evidence that supports your request.
                        You can upload up to 3 screenshots.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-10">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="relative w-[160px] animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                        >
                            <FormBox
                                inputType="imageUpload"
                                type="text"
                                label={`SCREENSHOT ${index + 1}`}
                                id={`evidence.${index}.url`}
                                name={`evidence.${index}.url`}
                                errors={index === 0 ? errors.evidence?.root : errors.evidence?.[index]?.url}
                                control={control}
                                register={register}
                                classname="w-[160px]"
                                imageDefaultStyle="h-[160px] w-[160px] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 flex items-center justify-center"
                                imagePreviewStyle="h-[160px] w-[160px] rounded-[12px]"
                                placeholder="Drag a screenshot or click to upload"
                            />

                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-0 -right-2 bg-background rounded-full"
                                >
                                    <CircleX className="w-4 h-4 transition hover:text-red-600" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {fields.length < 3 && (
                    <ActionBtn
                        type="button"
                        onClick={() => append({ url: null })}
                        text="+ Add another screenshot"
                        classname="w-fit"
                    />
                )}

                {fields.length === 3 && (
                    <p className="text-xs text-muted-foreground">
                        Maximum of 3 screenshots reached.
                    </p>
                )}
            </div>

            <FormBox
                inputType="textarea"
                type="textarea"
                label="ADDITIONAL INFORMATION"
                placeholder="Add anything else that may help us help review your request..."
                id="additionalInformation"
                name="additionalInformation"
                errors={errors.additionalInformation}
                classname="w-full"
                borderStyle="createEvent"
                register={register}
            />
        </div>
    )
}

export default RefundsForm