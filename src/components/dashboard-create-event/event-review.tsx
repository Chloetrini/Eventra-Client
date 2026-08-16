import type { EventFormValues } from "@/services/schema"
import { formatDate, formatNaira, formatTime } from "@/services/utils"
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
            value: values.locationType === "online"
                ? (values.onlinePlatform || "Online")
                : (values.address || "—")
        },
        ...ticketRows,
    ]

    return (
        <div className="w-full flex flex-col">
            <div className="">
                {rows.map((row) => {
                    return (
                        <div
                            key={row.label}
                            className={`w-full bg-card border-border border-b  px-3 py-3 flex items-center justify-between gap-6`}
                        >
                            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                <p className="font-grotesk text-muted-foreground">
                                    {row.label}
                                </p>
                            </div>

                            <p className="font-grotesk text-foreground text-right min-w-0 break-words font-medium">
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