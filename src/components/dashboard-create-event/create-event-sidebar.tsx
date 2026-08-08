import { useLocation, useNavigate } from "react-router"

export const createEventFlow = [
    {
        step: "Type",
        description: "Free or paid",
        path: "/dashboard/create-event"
    },
    {
        step: "Basics",
        description: "Name & details",
        path: "/dashboard/create-event/basics"
    },
    {
        step: "Location",
        description: "Venue or online",
        path: "/dashboard/create-event/location"
    },
    {
        step: "Tickets",
        description: "What to sell",
        path: "/dashboard/create-event/tickets"
    },
    {
        step: "Details",
        description: "Optional extras",
        path: "/dashboard/create-event/details"
    },
    {
        step: "Review",
        description: "Publish",
        path: "/dashboard/create-event/review"
    },
]

const CreateEventSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const currentPath = location.pathname

    const handleClick = (path: string) => {
        navigate(path)
    }

    return (
        <div>
            <h1 className='font-grotesk font-bold text-[28px] mb-2'>Create Event</h1>
            <div>
                <div className="flex flex-col gap-2">

                    {createEventFlow.map((flow, id) => (
                        <div key={flow.path}>
                            <button
                                className={`group w-[257px] h-[75px] rounded-[7px] flex items-center gap-3 p-[15px]  hover:bg-[#E4F1EB] ${flow.path === currentPath ? "bg-[#E4F1EB]" : ""}`}
                                onClick={() => handleClick(flow.path)}>
                                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center  group-hover:bg-[#0F6E56]  group-hover:text-white group-hover:border-0 ${flow.path === currentPath ? "bg-[#0F6E56] text-white" : "border border-[#6E6577] text-[#6E6577]"}`}>
                                    <p className="font-bold font-space text-[11px]">{id + 1}</p>
                                </div>

                                <div className={`text-start  group-hover:text-[#0F6E56]`}>
                                    <p className={`font-semibold ${flow.path === currentPath ? "text-[#0F6E56]" : "text-[#6E6577]"}`}>{flow.step}</p>
                                    <p className={`text-[13px] ${flow.path === currentPath ? "text-[#0F6E56]" : "text-[#6E6577]"}`}>{flow.description}</p>
                                </div>

                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CreateEventSidebar