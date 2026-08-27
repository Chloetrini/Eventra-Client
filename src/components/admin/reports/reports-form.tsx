import { useEffect } from "react"
import type { ReportValues } from "@/lib/schema"
import { useFormContext, useFieldArray, useFormState } from "react-hook-form"
import { FormBox } from '@/components/ui/form-box'
import ActionBtn from "@/components/ui/action-btn"
import { CircleX } from "lucide-react"

type ReportFormProps = {
    title?: string | undefined
}

// Nav-state reading, the "event not found" fallback, and page chrome
// (back button, PageWrapper) live in this page's index.tsx — same
// split as RefundsForm, which is dropped into its own index without
// owning layout or knowing where its data came from. This component
// only cares that it has an eventType/eventId to attach the report to.
const ReportForm = ({ title }: ReportFormProps) => {
    const { register, control, setValue } = useFormContext<ReportValues>()
    const { errors } = useFormState({ control })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "evidence",
    })

    // eventType/eventId are hidden form fields (validated in reportSchema)
    // rather than assembled separately at submit time, so the same
    // handleSubmit(onSubmit) flow used everywhere else in the app works
    // here without a special case. Setting them in an effect (not inline
    // during render) keeps this a pure render pass — setValue triggers
    // its own re-render via the form's subscription, so calling it while
    // rendering would just be doing that work twice.


    return (
        <div className="flex flex-col gap-5">
            {title && (
                <p className="text-[15px] text-muted-foreground">
                    You're reporting <span className="font-semibold text-foreground text-lg text-red-500">{title}</span>
                </p>
            )}

            <FormBox
                inputType="select"
                type="select"
                label="CATEGORY"
                placeholder="Select a category"
                id="category"
                name="category"
                errors={errors.category}
                register={register}
                control={control}
                options={[
                    "Scam or fraud",
                    "Misleading event details",
                    "Inappropriate content",
                    "Impersonation",
                    "Spam",
                    "Other",
                ]}
                classname="w-full"
                borderStyle="createEvent"
            />

            <FormBox
                inputType="textarea"
                type="textarea"
                label="WHAT'S WRONG?"
                placeholder="Please explain what's wrong with this event and why it should be reviewed..."
                id="reason"
                name="reason"
                errors={errors.reason}
                classname="w-full"
                borderStyle="createEvent"
                register={register}
            />

            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-sm font-medium">EVIDENCE</p>
                    <p className="text-xs text-muted-foreground mt-1 ">
                        Upload screenshots or other evidence that supports your report.
                        You can upload up to 3 screenshots.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-10">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="relative w-40 animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
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
                                classname="w-40"
                                imageDefaultStyle="h-[160px] w-[160px] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 flex items-center justify-center"
                                imagePreviewStyle="h-[160px] w-[160px] rounded-[12px]"
                                placeholder="Drag a screenshot or click to upload"
                                imageVariant="report-evidence"
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
                placeholder="Add anything else that may help us review this report..."
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

export default ReportForm