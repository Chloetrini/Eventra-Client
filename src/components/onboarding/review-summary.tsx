import { useFormContext, useWatch } from "react-hook-form"
import { Building2, Tag, Mail, Landmark, type LucideIcon } from "lucide-react"
import type { OnboardingValues } from "@/services/schema"

type ReviewRow = {
    icon: LucideIcon
    label: string
    value: string
}

const ReviewSummary = () => {
    // reads the same form instance the layout owns — watch() so the card
    // updates if the user goes Back and edits something
    const { control } = useFormContext<OnboardingValues>()
    const values = useWatch({ control })

    // bank step is skippable, so these can legitimately be empty
    const hasBank = Boolean(values.bank && values.accountNumber)
    const maskedAccount = values.accountNumber
        ? `••••${values.accountNumber.slice(-4)}`
        : ""

    const rows: ReviewRow[] = [
        {
            icon: Building2,
            label: "Organization",
            // "Lagos Live Co. - Lagos" — drops the dash if either half is empty
            value:
                [values.organizationName, values.city].filter(Boolean).join(" - ") ||
                "—",
        },
        {
            icon: Tag,
            label: "Category",
            value: values.category || "—",
        },
        {
            icon: Mail,
            label: "Contact",
            value: values.email || values.contactPhone || "—",
        },
        {
            icon: Landmark,
            label: "Bank account",
            value: hasBank
                ? `${values.bank} - ${maskedAccount}`
                : "Not added yet (you can add it later in settings)",
        },
    ]

    return (
        <div className="w-full flex flex-col">
            <div className="border-2 rounded-[20px]">
            {rows.map((row, id) => {
                const Icon = row.icon
                const isLastRow = id === rows.length - 1

                return (
                    <div
                        key={row.label}
                        className={`w-full bg-card  border-border rounded-[20px] px-6 py-6 flex items-center justify-between gap-6 text-sm ${isLastRow ? "border-b-0 " : "border-b-2"}`}
                    >
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            <Icon
                                className="w-6 h-6 text-muted-foreground shrink-0"
                                strokeWidth={1.5}
                            />
                            <p className="font-grotesk md:text-[18px] text-muted-foreground">
                                {row.label}
                            </p>
                        </div>

                        <p className="font-grotesk md:text-[18px] text-muted-foreground text-right min-w-0 break-words">
                            {row.value}
                        </p>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default ReviewSummary