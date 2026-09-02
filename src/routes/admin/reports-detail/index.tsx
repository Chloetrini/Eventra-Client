import UserReportDetails from "@/components/admin/reports/user-report-details"
import PageWrapper from "@/components/page-wrapper"

import type { UserReportPopulated } from "@/types/report"
import { ArrowLeft, Check } from "lucide-react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify"

const FullReportDetails = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const report = location.state?.report as UserReportPopulated | undefined

    useEffect(() => {
        if (!report) {
            toast.error("No report selected.", { toastId: "no-report-selected" })
            // navigate("/admin/reports")
        }
    }, [report, navigate])
    return (
        <PageWrapper className=" flex flex-col min-h-full justify-between p-5">
            <div className="">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80] mb-2 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO REPORTS LIST
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[28px] font-bold font-grotesk">Report Details</h1>
                    </div>
                </div>
                <UserReportDetails report={report!} />
            </div>
        </PageWrapper>
    )
}

export default FullReportDetails