import { CheckCircle2, ExternalLink } from "lucide-react"
import { formatRequestedAgo } from "@/lib/utils"
import type { AdminOrganizer } from "@/types/admin-organizer"

function maskAccountNumber(accNo?: string): string {
  if (!accNo) return "—"
  if (accNo.length <= 4) return accNo
  return `******${accNo.slice(-4)}`
}

interface OrganizerApprovalDetailsProps {
  organizer: AdminOrganizer
}

const OrganizerApprovalDetails = ({ organizer }: OrganizerApprovalDetailsProps) => {
  const details = organizer.details
  const bank = details?.bankDetails

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
      {/* Left Column: Organization Details & Verification Documents */}
      <div className="flex flex-col gap-5">
        {/* Organization Information Card */}
        <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
          <h2 className="text-xl font-bold font-grotesk mb-4">Organization</h2>

          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">Name</p>
            <p className="font-bold text-end">{organizer.name}</p>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">Category</p>
            <p className="font-bold text-end">{organizer.category ?? "Uncategorized"}</p>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">City</p>
            <p className="font-bold text-end">{details?.address ?? "Not provided"}</p>
          </div>
          <div className="flex justify-between items-center py-3">
            <p className="text-[#4A4451] dark:text-gray-300">Contact</p>
            <p className="font-bold text-end">{organizer.email}</p>
          </div>
        </div>

        {/* Verification Documents Card */}
        <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
          <h2 className="text-xl font-bold font-grotesk mb-4">Verification documents</h2>

          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">CAC certificate</p>
            {details?.cacCertificateUrl ? (
              <a
                href={details.cacCertificateUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80]"
              >
                Uploaded <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="font-bold text-end text-muted-foreground">Not uploaded</p>
            )}
          </div>

          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">Director ID</p>
            {details?.directorIdUrl ? (
              <a
                href={details.directorIdUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80]"
              >
                Uploaded <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="font-bold text-end text-muted-foreground">Not uploaded</p>
            )}
          </div>

          <div className="flex justify-between items-center py-3">
            <p className="text-[#4A4451] dark:text-gray-300">Proof of address</p>
            {details?.proofOfAddressUrl ? (
              <a
                href={details.proofOfAddressUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80]"
              >
                Uploaded <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="font-bold text-end text-muted-foreground">Not uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Bank Info & History */}
      <div className="flex flex-col gap-5">
        {/* Bank Information Card */}
        <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E8E6E0] dark:bg-muted flex items-center justify-center font-bold">
              🏦
            </div>
            <div>
              <p className="font-bold">
                {bank?.bankName ?? "Bank"}:{" "}
                <span className="font-space">{maskAccountNumber(bank?.accountNumber)}</span>
              </p>
              <p className="text-xs text-muted-foreground font-space">
                Verified with paystack
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">Account name</p>
            <p className="font-bold text-end">{bank?.accountName ?? "—"}</p>
          </div>
          <div className="flex justify-between items-center py-3">
            <p className="text-[#4A4451] dark:text-gray-300">Name match</p>
            <p className="font-bold text-end flex items-center gap-1 text-[#0F6E56] dark:text-[#4ADE80]">
              {bank?.isPayoutReady ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirmed
                </>
              ) : (
                <span className="text-[#BE2525]">Unverified</span>
              )}
            </p>
          </div>
        </div>

        {/* History Card */}
        <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6 shadow-xl">
          <h2 className="text-xl font-bold font-grotesk mb-4">History</h2>

          <div className="flex justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border">
            <p className="text-[#4A4451] dark:text-gray-300">Events run</p>
            <p className="font-bold text-end">
              {organizer.eventCount} {organizer.eventCount === 0 ? "(new)" : ""}
            </p>
          </div>
          <div className="flex justify-between items-center py-3">
            <p className="text-[#4A4451] dark:text-gray-300">Submitted</p>
            <p className="font-bold text-end">{formatRequestedAgo(organizer.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerApprovalDetails