import { useState } from "react"
import { CheckCircle2, ExternalLink, ShieldAlert, ShieldCheck, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { formatRequestedAgo } from "@/lib/utils"
import type { AdminOrganizer } from "@/types/admin-organizer"
import { useToggleSuspendOrganizer } from "@/hooks/use-admin-organizers"

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

  const { mutate: toggleSuspend, isPending } = useToggleSuspendOrganizer()
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")

  // Matches your AdminOrganizerStatus enum values ("VERIFIED" | "SUSPENDED")
  const isApprovedOrSuspended =
    organizer.status === "VERIFIED" ||
    organizer.status === "SUSPENDED" ||
    organizer.isSuspended

  const handleActionClick = () => {
    if (organizer.isSuspended) {
      toggleSuspend(
        { id: organizer._id, isSuspended: true },
        {
          onSuccess: () => {
            toast.success(`Organizer "${organizer.name}" account unsuspended successfully.`)
          },
          onError: (error) => {
            toast.error(error.message || "Failed to unsuspend organizer account.")
          },
        }
      )
    } else {
      setSuspendReason("")
      setIsSuspendModalOpen(true)
    }
  }

  const handleConfirmSuspend = (e: React.FormEvent) => {
    e.preventDefault()
    toggleSuspend(
      {
        id: organizer._id,
        isSuspended: false,
        reason: suspendReason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsSuspendModalOpen(false)
          setSuspendReason("")
          toast.success(`Organizer "${organizer.name}" has been suspended.`)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to suspend organizer account.")
        },
      }
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-6">
        {/* Left Column: Organization Details, Verification Documents & Bottom Action Button */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Organization Information Card */}
          <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-4 sm:p-6 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold font-grotesk mb-3 sm:mb-4">Organization</h2>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-1 sm:gap-4">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base shrink-0">Name</p>
              <p className="font-bold sm:text-end text-sm sm:text-base break-words">{organizer.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-1 sm:gap-4">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base shrink-0">Category</p>
              <p className="font-bold sm:text-end text-sm sm:text-base">{organizer.category ?? "Uncategorized"}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-1 sm:gap-4">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base shrink-0">City</p>
              <p className="font-bold sm:text-end text-sm sm:text-base">{details?.address ?? "Not provided"}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-1 sm:gap-4">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base shrink-0">Contact</p>
              <p className="font-bold sm:text-end text-sm sm:text-base break-all">{organizer.email}</p>
            </div>
          </div>

          {/* Verification Documents Card */}
          <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-4 sm:p-6 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold font-grotesk mb-3 sm:mb-4">Verification documents</h2>

            <div className="flex flex-row justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">CAC certificate</p>
              {details?.cacCertificateUrl ? (
                <a
                  href={details.cacCertificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80] text-sm sm:text-base shrink-0"
                >
                  Uploaded <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <p className="font-bold text-end text-muted-foreground text-sm sm:text-base shrink-0">Not uploaded</p>
              )}
            </div>

            <div className="flex flex-row justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">Director ID</p>
              {details?.directorIdUrl ? (
                <a
                  href={details.directorIdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80] text-sm sm:text-base shrink-0"
                >
                  Uploaded <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <p className="font-bold text-end text-muted-foreground text-sm sm:text-base shrink-0">Not uploaded</p>
              )}
            </div>

            <div className="flex flex-row justify-between items-center py-3 gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">Proof of address</p>
              {details?.proofOfAddressUrl ? (
                <a
                  href={details.proofOfAddressUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-end flex items-center gap-1 hover:underline text-[#0F6E56] dark:text-[#4ADE80] text-sm sm:text-base shrink-0"
                >
                  Uploaded <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <p className="font-bold text-end text-muted-foreground text-sm sm:text-base shrink-0">Not uploaded</p>
              )}
            </div>
          </div>

          {/* Bottom Left Action Button */}
          {isApprovedOrSuspended && (
            <div className="pt-2">
              <button
                onClick={handleActionClick}
                disabled={isPending}
                className={`py-3 px-6 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${
                  organizer.isSuspended
                    ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]"
                    : "bg-[#BE2525] text-white hover:bg-[#a11f1f]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {organizer.isSuspended ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    {isPending ? "Unsuspending..." : "Unsuspend organizer"}
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    {isPending ? "Suspending..." : "Suspend organizer"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Bank Info & History */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Bank Information Card */}
          <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#E8E6E0] dark:bg-muted flex items-center justify-center font-bold shrink-0">
                🏦
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base truncate">
                  {bank?.bankName ?? "Bank"}:{" "}
                  <span className="font-space">{maskAccountNumber(bank?.accountNumber)}</span>
                </p>
                <p className="text-xs text-muted-foreground font-space">
                  Verified with paystack
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-1 sm:gap-4">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base shrink-0">Account name</p>
              <p className="font-bold sm:text-end text-sm sm:text-base break-words">{bank?.accountName ?? "—"}</p>
            </div>
            <div className="flex flex-row justify-between items-center py-3 gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">Name match</p>
              <p className="font-bold text-end flex items-center gap-1 text-[#0F6E56] dark:text-[#4ADE80] text-sm sm:text-base shrink-0">
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
          <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-4 sm:p-6 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold font-grotesk mb-3 sm:mb-4">History</h2>

            <div className="flex flex-row justify-between items-center py-3 border-b border-[#E8E6E0] dark:border-border gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">Events run</p>
              <p className="font-bold text-end text-sm sm:text-base shrink-0">
                {organizer.eventCount} {organizer.eventCount === 0 ? "(new)" : ""}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center py-3 gap-2">
              <p className="text-[#4A4451] dark:text-gray-300 text-sm sm:text-base">Submitted</p>
              <p className="font-bold text-end text-sm sm:text-base shrink-0">{formatRequestedAgo(organizer.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suspension Reason Dialog Modal */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border-2 border-[#E8E6E0] dark:border-border rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsSuspendModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-grotesk mb-2">Suspend Organizer Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Provide an optional reason for suspending <span className="font-semibold text-foreground">{organizer.name}</span>. This will be logged and included in their notification.
            </p>

            <form onSubmit={handleConfirmSuspend} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Reason for Suspension (Optional)
                </label>
                <textarea
                  rows={4}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. Terms violation, fraudulent listings, or account verification discrepancy..."
                  className="w-full p-3 rounded-lg border border-[#E8E6E0] dark:border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-[#BE2525] text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuspendModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-bold text-sm border border-[#E8E6E0] dark:border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg font-bold text-sm bg-[#BE2525] text-white hover:bg-[#a11f1f] transition-colors disabled:opacity-50"
                >
                  {isPending ? "Suspending..." : "Confirm Suspension"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default OrganizerApprovalDetails