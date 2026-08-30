import ReportForm from "@/components/admin/reports/reports-form"
import PageWrapper from "@/components/page-wrapper"
import { useEvent } from "@/hooks/use-event"
import { reportSchema, type ReportValues } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { useLocation, useNavigate, } from "react-router"
import { toast } from "react-toastify"
import type { Event } from "@/types/event-types"
import ActionBtn from "@/components/ui/action-btn"
import { useCreateReportRequest } from "@/hooks/use-reports"

const REPORTS_STORAGE_KEY = "eventra-report-event"

const emptyValues: ReportValues = {
    category: "",
    reason: "",
    evidence: [{ url: null }],
    additionalInformation: "",
}


const getSavedValues = (): Partial<ReportValues> => {
    try {
        const raw = sessionStorage.getItem(REPORTS_STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

const ReportEvent = () => {
    const reportsMutation = useCreateReportRequest()
    const location = useLocation()
    const event = location.state?.event as Event | undefined
    // const { data: event, isLoading, isError } = useEvent(slug)
    const navigate = useNavigate()

    useEffect(() => {
        if (!event) {
            toast.error("No event selected for this report request.", { toastId: "no-event-selected" })
            navigate("/explore")
        }
    }, [event, navigate])

    const methods = useForm<ReportValues>({
        resolver: zodResolver(reportSchema) as Resolver<ReportValues>,
        mode: 'onBlur',
        defaultValues: { ...emptyValues, ...getSavedValues() },
    })

    useEffect(() => {
        const subscription = methods.watch((values) => {
            try {
                sessionStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(values))
            } catch {
                // storage full or unavailable — form still works in-memory
            }
        })
        return () => subscription.unsubscribe()
    }, [methods])

    const onSubmit = (data: ReportValues) => {
        if (!event) return
        const payload = {
            ...data,
            eventId: event._id,
            targetType: "event" as const,
        },
            onSuccess = () => {
                toast.success("Report submitted successfully.", { toastId: "report-submitted" })
                sessionStorage.removeItem(REPORTS_STORAGE_KEY)
                navigate("/explore")
            },
            onError = (error: any) => {
                const message = error?.response?.data?.message || "An error occurred while submitting the report."
                toast.error(message, { toastId: "report-error" })
            }
        reportsMutation.mutate(payload, { onSuccess, onError })
    }

    return (
        <FormProvider {...methods}>
            <PageWrapper className="p-5">
                <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                    <div className="mb-6">
                        <h3 className="font-grotesk font-bold text-[34px] text-[#0F6E56] dark:text-[#4ADE80]">Report Event</h3>
                        <p className="font-grotesk font-medium md:text-[18px] text-muted-foreground max-w-[500px] line-clamp-5">
                            Please fill out the form below to report an issue with the event. Your report will be reviewed by our team, and appropriate action will be taken if necessary.
                        </p>
                    </div>
                    <ReportForm
                        title={event?.title}
                    />
                    <div className="w-full flex justify-end mt-7">
                        <ActionBtn
                            type="submit"
                            text={reportsMutation.isPending ? "Submitting..." : "Submit Report"}
                            classname="w-fit bg-[#0F6E56] font-bold py-5 px-5 dark:text-white"
                            disabled={reportsMutation.isPending}
                        />
                    </div>
                </form>
            </PageWrapper>
        </FormProvider>
    )
}

export default ReportEvent