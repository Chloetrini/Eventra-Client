import type { EventFormValues } from "@/lib/schema"
import { formatDate, formatNaira, formatTime } from "@/lib/utils"
import { useFormContext, useWatch } from "react-hook-form"

type EventReviewRow = {
    label: string
    value: string | number
}

const EventReview = () => {

    const { control } = useFormContext<EventFormValues>()
    const values = useWatch({ control })

    const isPaid = values.eventType === "paid"

    // paid: one row per ticket tier, pulled straight from the tickets array
    // free: single row summarising the RSVP limit (or "Unlimited" if none set)
    const ticketRows: EventReviewRow[] = isPaid
        ? (values.tickets && values.tickets.length > 0
            ? values.tickets.map((ticket, id) => ({
                label: values.tickets!.length > 1
                    ? `Ticket ${id + 1}: ${ticket?.name || "—"}`
                    : "Ticket type",
                value: ticket
                    ? `${formatNaira(ticket.price ?? 0)} · ${ticket.quantity ?? "—"} available`
                    : "—",
            }))
            : [{ label: "Ticket types", value: "—" }])
        : [{
            label: "Ticket types",
            value: values.hasRsvpLimit
                ? `${values.rsvpLimit ?? "—"} RSVPs`
                : "Unlimited",
        }]

    const rows: EventReviewRow[] = [
        {
            label: "Name",
            value: values.title || "—"
        },
        // {
        //     label: "Type",
        //     value: values
        // },
        {
            label: "Category",
            value: values.category || "—"
        },
        {
            label: "When",
            value:
                [
                    values.date ? formatDate(values.date) : undefined,
                    values.startTime ? formatTime(values.startTime) : undefined,
                ].filter(Boolean).join(" - ") || "—"
        },
        {
            label: "Location",
            value: values.address || "—"
        },
        ...ticketRows,
    ]

    return (
        <div className="w-full flex flex-col">
            <div className="">
                {rows.map((row, id) => {
                    return (
                        <div
                            key={row.label}
                            className={`w-full bg-white border-[#E8E6E0] border-b  px-3 py-3 flex items-center justify-between gap-6`}
                        >
                            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                <p className="font-grotesk text-[#3A3A3A]">
                                    {row.label}
                                </p>
                            </div>

                            <p className="font-grotesk text-[#1A1523] text-right min-w-0 break-words font-medium">
                                {row.value}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default EventReview