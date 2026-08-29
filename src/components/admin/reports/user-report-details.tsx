import { formatRequestedAgo } from "@/lib/utils"
import type { UserReportPopulated } from "@/types/report"

interface UserReportDetailsProps {
    report: UserReportPopulated
}

const UserReportDetails = ({ report }: UserReportDetailsProps) => {
    const isOrganizerReport = report.targetType === "organizer"

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Report</h2>

                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Reported by</p>
                        <p className="font-bold text-end">{report.reporterName}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 w-20 md:w-fit">Target type</p>
                        <p className="font-bold text-end capitalize">{report.targetType}</p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Reported event</p>
                        <p className="font-bold text-end">{report.event?.title ?? "Event unavailable"}</p>
                    </div>

                    {/* Organizer details only apply when the report targets the
                        organizer rather than the event itself */}
                    {isOrganizerReport && (
                        <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                            <p className="text-[#4A4451] dark:text-gray-300">Reported organizer</p>
                            <p className="font-bold text-end">
                                {report.organizer
                                    ? `${report.organizer.fullname} (${report.organizer.email})`
                                    : "Organizer unavailable"}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300">Category</p>
                        <p className="font-bold text-end capitalize">{report.category}</p>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <p className="text-[#4A4451] dark:text-gray-300">Requested</p>
                        <p className="font-bold text-end">{formatRequestedAgo(report.createdAt)}</p>
                    </div>
                </div>

                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Reason</h2>

                    <div className="py-3 border-b border-[#E8E6E0] dark:border-border">
                        <p className="text-[#4A4451] dark:text-gray-300 mb-1">Reporter's reason</p>
                        <p>{report.reason}</p>
                    </div>

                    {report.additionalInformation && (
                        <div className="pt-3">
                            <p className="text-[#4A4451] dark:text-gray-300 mb-1">Additional information</p>
                            <p>{report.additionalInformation}</p>
                        </div>
                    )}

                    {/* No policy-violation callout here (unlike refunds) since a
                        report has no approve/override semantics of its own —
                        add one back if reports later need a similar flag */}
                </div>
            </div>

            {(report.evidence?.length ?? 0) > 0 && (
                <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 mt-5 shadow-xl">
                    <h2 className="text-xl font-bold font-grotesk mb-4">Evidence</h2>
                    <div className="flex flex-wrap gap-4">
                        {report.evidence
                            ?.filter((item) => item.url)
                            .map((item, index) => (
                                <a
                                    key={item.url}
                                    href={item.url!}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-[160px] h-[160px] rounded-[12px] overflow-hidden border border-[#E8E6E0] shadow-xl"
                                >
                                    <img
                                        src={item.url!}
                                        alt={`Evidence ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </a>
                            ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default UserReportDetails