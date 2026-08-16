import { useLocation, useNavigate } from "react-router"
import { useFormContext } from "react-hook-form"
import type { Path } from "react-hook-form"
import type { EventFormValues } from "@/services/schema"
import {
    TYPE_FIELDS,
    BASICS_FIELDS,
    LOCATION_FIELDS,
    RSVP_FIELDS,
    TICKETS_FIELDS,
    DETAILS_FIELDS,
} from "@/services/schema"

export const createEventFlow = [
    {
        step: "Type",
        description: "Free or paid",
        paths: ["/dashboard/create-event/type"],
        getFields: (): Path<EventFormValues>[] => TYPE_FIELDS,
    },
    {
        step: "Basics",
        description: "Name & details",
        paths: ["/dashboard/create-event/basics"],
        getFields: (): Path<EventFormValues>[] => BASICS_FIELDS,
    },
    {
        step: "Location",
        description: "Venue or online",
        paths: ["/dashboard/create-event/location"],
        getFields: (): Path<EventFormValues>[] => LOCATION_FIELDS,
    },
    {
        step: "Tickets",
        description: "What to sell",
        paths: ["/dashboard/create-event/tickets", "/dashboard/create-event/rsvp"],
        getFields: (eventType?: EventFormValues['eventType']): Path<EventFormValues>[] =>
            eventType === 'free' ? RSVP_FIELDS : TICKETS_FIELDS,
    },
    {
        step: "Details",
        description: "Optional extras",
        paths: ["/dashboard/create-event/details"],
        getFields: (): Path<EventFormValues>[] => DETAILS_FIELDS,
    },
    {
        step: "Review",
        description: "Publish",
        paths: ["/dashboard/create-event/review"],
        getFields: (): Path<EventFormValues>[] => [],
    },
]

// Shared source of truth for "which step am I on" — derived from the same
// createEventFlow array the sidebar uses, so the two can never drift apart.
// Any step page can call this directly to get its own step number, without
// needing it passed down as a prop (the pages and the sidebar are siblings
// under the layout's <Outlet/>, not parent/child, so props can't flow between them).
export const useCreateEventStep = () => {
    const location = useLocation()
    const currentPath = location.pathname

    const currentStepIndex = createEventFlow.findIndex((flow) =>
        flow.paths.includes(currentPath)
    )

    // fallback to the first step if the URL doesn't match anything known,
    // same safety net the sidebar itself uses
    const effectiveCurrentIndex = currentStepIndex === -1 ? 0 : currentStepIndex

    return {
        currentStepIndex: effectiveCurrentIndex, // 0-based, useful for comparisons
        currentStep: effectiveCurrentIndex + 1,  // 1-based, for display: "Step X of Y"
        totalSteps: createEventFlow.length,
    }
}

const CreateEventSidebar = () => {
    const navigate = useNavigate()
    const { getValues, trigger } = useFormContext<EventFormValues>()
    const { currentStepIndex: effectiveCurrentIndex } = useCreateEventStep()
    const location = useLocation()
    const currentPath = location.pathname

    const handleClick = async (targetIndex: number, paths: string[]) => {
        const eventType = getValues('eventType')

        const target = paths.length === 1
            ? paths[0]
            : (eventType === 'free'
                ? paths.find((p) => p.endsWith('/rsvp'))
                : paths.find((p) => p.endsWith('/tickets'))) ?? paths[0]

        if (targetIndex <= effectiveCurrentIndex) {
            navigate(target)
            return
        }

        for (let i = effectiveCurrentIndex; i < targetIndex; i++) {
            const fields = createEventFlow[i].getFields(eventType)
            if (fields.length === 0) continue

            const isValid = await trigger(fields)
            if (!isValid) return
        }

        navigate(target)
    }

    return (
        // Below `lg` this becomes a horizontally-scrolling step strip instead
        // of a permanent 257px-wide column — at phone widths a fixed vertical
        // sidebar would eat most of the screen and leave almost nothing for
        // the actual form.
        <div className="lg:w-[289px] lg:shrink-0">
            <h1 className='font-grotesk font-bold text-[22px] sm:text-[28px] mb-2'>Create Event</h1>
            <div>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-col [&::-webkit-scrollbar]:hidden">

                    {createEventFlow.map((flow, id) => {
                        const isActive = flow.paths.includes(currentPath)
                        const isCompleted = id < effectiveCurrentIndex

                        return (
                            <div key={flow.paths[0]} className="shrink-0">
                                <button
                                    className={`group w-[220px] sm:w-[257px] h-[70px] sm:h-[75px] shrink-0 rounded-[7px] flex items-center gap-3 p-[15px]  hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 ${isActive ? "bg-[#E4F1EB] dark:bg-[#0F6E56]/15" : ""}`}
                                    onClick={() => handleClick(id, flow.paths)}>
                                    <div className={`w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center  group-hover:bg-[#0F6E56]  group-hover:text-white group-hover:border-0 ${isActive || isCompleted ? "bg-[#0F6E56] text-white" : "border border-[#6E6577] dark:border-muted-foreground text-muted-foreground"}`}>
                                        <p className="font-bold font-space text-[11px]">{id + 1}</p>
                                    </div>

                                    <div className={`text-start min-w-0 group-hover:text-[#0F6E56] dark:group-hover:text-[#4ADE80]`}>
                                        <p className={`font-semibold truncate ${isActive ? "text-[#0F6E56] dark:text-[#4ADE80]" : "text-muted-foreground"}`}>{flow.step}</p>
                                        <p className={`text-[13px] truncate ${isActive ? "text-[#0F6E56] dark:text-[#4ADE80]" : "text-muted-foreground"}`}>{flow.description}</p>
                                    </div>

                                </button>

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CreateEventSidebar