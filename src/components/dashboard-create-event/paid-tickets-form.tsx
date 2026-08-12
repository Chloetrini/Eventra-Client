import { useEffect } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import type { EventFormValues } from "@/lib/schema"
import { FormBox } from "../ui/form-box"
import ActionBtn from "../ui/action-btn"
import { CircleX } from "lucide-react"

const MAX_TICKETS = 5

const PaidTicketsForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tickets",
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({ name: "", price: undefined, quantity: undefined, limitPerPerson: undefined })
        }
    }, [fields.length, append])

    return (
        <div className="flex flex-col gap-5">
            {errors.tickets?.root?.message && (
                <p className="text-xs text-destructive">{errors.tickets.root.message}</p>
            )}

            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="flex flex-col gap-3 border border-[#E8E6E0] rounded-[15px] p-4 animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                >
                    <div className="flex items-center justify-end gap-3">
                        <p className="text-sm font-medium">Ticket {index + 1}</p>
                        {index > 0 && (
                            <button type="button" onClick={() => remove(index)}>
                                <CircleX className="w-6 h-6 hover:text-red-600 transition" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <FormBox
                            inputType="input"
                            type="text"
                            label="TICKET TYPE"
                            placeholder="e.g Early Bird"
                            id={`tickets.${index}.name`}
                            name={`tickets.${index}.name`}
                            errors={errors.tickets?.[index]?.name}
                            register={register}
                            classname="w-full"
                            borderStyle="createEvent"
                        />
                        <FormBox
                            inputType="input"
                            type="number"
                            label="PRICE (₦)"
                            placeholder="e.g 15000"
                            id={`tickets.${index}.price`}
                            name={`tickets.${index}.price`}
                            errors={errors.tickets?.[index]?.price}
                            register={register}
                            registerOptions={{ valueAsNumber: true }}
                            classname="w-full"
                            borderStyle="createEvent"
                        />
                    </div>
                    <div className="flex gap-4">
                        <FormBox
                            inputType="input"
                            type="number"
                            label="QUANTITY"
                            placeholder="e.g 200"
                            id={`tickets.${index}.quantity`}
                            name={`tickets.${index}.quantity`}
                            errors={errors.tickets?.[index]?.quantity}
                            register={register}
                            registerOptions={{ valueAsNumber: true }}
                            classname="w-full"
                            borderStyle="createEvent"
                        />
                        <FormBox
                            inputType="input"
                            type="number"
                            label="LIMIT PER PERSON"
                            placeholder="e.g 4"
                            id={`tickets.${index}.limitPerPerson`}
                            name={`tickets.${index}.limitPerPerson`}
                            errors={errors.tickets?.[index]?.limitPerPerson}
                            register={register}
                            registerOptions={{ valueAsNumber: true }}
                            classname="w-full"
                            borderStyle="createEvent"
                        />
                    </div>
                </div>
            ))}

            <ActionBtn
                text="Add ticket type"
                type="button"
                onClick={() => {
                    if (fields.length < MAX_TICKETS) {
                        append({ name: "", price: undefined, quantity: undefined, limitPerPerson: undefined })
                    }
                }}
                disabled={fields.length >= MAX_TICKETS}
                classname="bg-white text-black border-[#E8E6E0] py-3 px-3.5 hover:text-white h-[46px] w-[168px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            />
        </div>
    )
}

export default PaidTicketsForm