import { useEffect } from "react"
import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import type { EventFormValues } from "@/lib/schema"
import { FormBox } from "../ui/form-box"
import ActionBtn from "../ui/action-btn"
import { CircleX } from "lucide-react"

const MAX_TICKETS = 5
const TICKET_CATEGORY_OPTIONS = [
  "Regular",
  "VIP",
  "Table",
]

const PaidTicketsForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const eventType = useWatch({ control, name: "eventType" })
    const tickets = useWatch({
  control,
  name: "tickets",
})
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tickets",
    })

    useEffect(() => {
        if (eventType === "paid" && fields.length === 0) {
            append({
                id: undefined,
                name: "",
                category: "Regular",
                tableSize: undefined,
                price: undefined,
                quantity: undefined,
                purchaseLimitPerPerson: undefined,
})
        } else if (eventType !== "paid" && fields.length > 0) {
            remove()
        }
    }, [eventType, fields.length, append, remove])

    return (
        <div className="flex flex-col gap-5">
            {errors.tickets?.root?.message && (
                <p className="text-xs text-destructive">{errors.tickets.root.message}</p>
            )}

            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="flex flex-col gap-3 border border-border rounded-[15px] p-4 animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                >
                    <div className="flex items-center justify-end gap-3">
                        <p className="text-sm font-medium">Ticket {index + 1}</p>
                        {index > 0 && (
                            <button type="button" onClick={() => remove(index)}>
                                <CircleX className="w-6 h-6 hover:text-red-600 transition" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
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
                            // Was minValue={1} — with a 10000 step, the browser's
                            // spinner snaps its FIRST click to minValue exactly
                            // (that's just how number inputs work), so it went
                            // 1, 10001, 20001 instead of clean 10000, 20000. Min
                            // now matches the step so it starts right on it.
                            minValue={10000}
                            stepValue={10000}
                            id={`tickets.${index}.price`}
                            name={`tickets.${index}.price`}
                            errors={errors.tickets?.[index]?.price}
                            register={register}
                            registerOptions={{ valueAsNumber: true }}
                            classname="w-full"
                            borderStyle="createEvent"
                        />
                    </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                        <FormBox
                            inputType="select"
                            type="select"
                            label="TICKET CATEGORY"
                            placeholder="Select ticket category"
                            id={`tickets.${index}.category`}
                            name={`tickets.${index}.category`}
                            errors={errors.tickets?.[index]?.category}
                            register={register}
                            control={control}
                            options={TICKET_CATEGORY_OPTIONS}
                            classname="w-full"
                            borderStyle="createEvent"
                        />

                        {tickets?.[index]?.category === "Table" && (
                            <FormBox
                                inputType="input"
                                type="number"
                                label="TABLE SIZE"
                                placeholder="e.g 5"
                                id={`tickets.${index}.tableSize`}
                                name={`tickets.${index}.tableSize`}
                                errors={errors.tickets?.[index]?.tableSize}
                                register={register}
                                registerOptions={{
                                    valueAsNumber: true,
                                }}
                                minValue={1}
                                stepValue={1}
                                classname="w-full"
                                borderStyle="createEvent"
                            />
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <FormBox
                            inputType="input"
                            type="number"
                            label="QUANTITY"
                            placeholder="e.g 200"
                            id={`tickets.${index}.quantity`}
                            // Same fix as price — min now matches the step so
                            // the spinner starts at 100 instead of snapping to 1
                            // on the first click.
                            minValue={100}
                            stepValue={100}
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
                            id={`tickets.${index}.purchaseLimitPerPerson`}
                            minValue={1}
                            
                            name={`tickets.${index}.purchaseLimitPerPerson`}
                            errors={errors.tickets?.[index]?.purchaseLimitPerPerson}
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
                        append({ id: undefined, name: "", price: undefined, quantity: undefined, purchaseLimitPerPerson: undefined })
                    }
                }}
                disabled={fields.length >= MAX_TICKETS}
                classname="bg-background text-foreground border border-border py-3 px-3.5 hover:text-white h-[46px] w-[168px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            />
        </div>
    )
}

export default PaidTicketsForm
