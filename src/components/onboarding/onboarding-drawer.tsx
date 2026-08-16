import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Menu, X } from "lucide-react"
import { stepsFlow } from "./sidebar"
import { useStepGuard } from "@/services/use-step-guard"

const OnboardingDrawer = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const { canJumpTo } = useStepGuard()

    // lock page scroll behind the drawer while it's open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    const handleClick = async (path: string) => {
        const targetIndex = stepsFlow.findIndex((s) => s.path === path)
        const allowed = await canJumpTo(targetIndex)
        if (allowed) {
            navigate(path)
            setOpen(false)
        }
    }

    return (
            location.pathname !== "/onboarding/success" && (
        <>
 
            <button
                type="button"
                aria-label="Open onboarding steps"
                onClick={() => setOpen(true)}
                className="lg:hidden p-2 -ml-2 cursor-pointer"
            >
                <Menu className="w-6 h-6" />
            </button>

  
            <div
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            <div
                role="dialog"
                aria-label="Onboarding steps"
                className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-card z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-end p-4">
                    <button
                        type="button"
                        aria-label="Close onboarding steps"
                        onClick={() => setOpen(false)}
                        className="p-2 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 px-4 pb-8">
                    {stepsFlow.map((flow, id) => (
                        <div key={flow.path}>
                            <button
                                className={`flex flex-col items-start justify-center text-start w-full h-[87px] rounded-[10px] p-5 ${
                                    flow.path === location.pathname ? "bg-[#E4F1EB] dark:bg-[#0F6E56]/15" : ""
                                }`}
                                onClick={() => handleClick(flow.path)}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${
                                            flow.path === location.pathname
                                                ? "text-white bg-[#0F6E56]"
                                                : "bg-white dark:bg-card border-2"
                                        }`}
                                    >
                                        <p className="font-semibold">{id + 1}</p>
                                    </div>

                                    <div>
                                        <p className="font-medium">{flow.step}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {flow.description}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {id + 1 !== stepsFlow.length && (
                                <div className="h-6 border-l-2 ml-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
            )
    )
}

export default OnboardingDrawer