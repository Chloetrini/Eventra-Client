import { useEffect, useState } from "react"
import PageWrapper from "@/components/page-wrapper"
import RefundsForm from "@/components/payment-refunds/refunds-form"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { refundsSchema, type RefundsValues } from "@/lib/schema"
import ActionBtn from "@/components/ui/action-btn"
import { useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { requestTicketRefund } from "@/lib/tickets-api"

const REFUNDS_STORAGE_KEY = "eventra-refund-request"

const emptyValues: RefundsValues = {
    reason: "",
    description: "",
    requestedResolution: "",
    evidence: [{ url: null }],
    additionalInformation: "",
}

const getSavedValues = (): Partial<RefundsValues> => {
    try {
        const raw = localStorage.getItem(REFUNDS_STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

const Refunds = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const ticketId = location.state?.ticketId as string | undefined
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!ticketId) {
            toast.error("No ticket selected for this refund request.", { toastId: "no-ticket-selected" })
            navigate("/tickets")
        }
    }, [ticketId, navigate])

    const methods = useForm<RefundsValues>({
        resolver: zodResolver(refundsSchema) as Resolver<RefundsValues>,
        mode: 'onBlur',
        defaultValues: { ...emptyValues, ...getSavedValues() },
    })

    useEffect(() => {
        const subscription = methods.watch((values) => {
            try {
                localStorage.setItem(REFUNDS_STORAGE_KEY, JSON.stringify(values))
            } catch {
                // storage full or unavailable — form still works in-memory
            }
        })
        return () => subscription.unsubscribe()
    }, [methods])

    const onSubmit = async (data: RefundsValues) => {
        if (!ticketId) return
        setIsSubmitting(true)
        try {
            // Sends the form as-is (reason, description, requestedResolution,
            // evidence, additionalInformation) — the backend now stores each
            // field on the RefundRequest instead of the old single collapsed
            // `reason` string, so nothing here needs pre-processing anymore.
            await requestTicketRefund(ticketId, data)
            localStorage.removeItem(REFUNDS_STORAGE_KEY)
            toast.success("Refund request submitted — an admin will review it shortly.")
            navigate("/tickets")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not submit your refund request. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormProvider {...methods}>
            <PageWrapper className="p-5 min-h-screen">
                <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                    <div className="mb-6">
                        <h3 className="font-grotesk font-bold text-[34px] text-[#0F6E56] dark:text-[#4ADE80]">Refund request</h3>
                        <p className="font-grotesk font-medium text-[18px] text-muted-foreground max-w-[500px] line-clamp-4">
                            Please fill out the form below to request a refund. We will review your request and get back to you as soon as possible.
                        </p>
                    </div>
                    <RefundsForm />
                    <div className="w-full flex justify-end mt-7">
                        <ActionBtn
                            type="submit"
                            text="Submit Request"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            classname="w-fit bg-[#0F6E56] font-bold py-5 px-5 dark:text-white"
                        />
                    </div>
                </form>
            </PageWrapper>
        </FormProvider>
    )
}

export default Refunds
