import ActionBtn from "@/components/ui/action-btn"
import type { AwaitingPayoutItem } from "@/lib/api/admin-payouts"
import { useReleasePayout } from "@/hooks/use-admin-payouts"
import { CURRENCY_SYMBOLS } from "@/lib/utils"

// Was hardcoded to ₦ regardless of the admin's currency preference.
function formatExactCurrency(amount: number, currency: string = "Naira"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "₦"
  return `${symbol}${amount.toLocaleString("en-NG")}`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function initialsFor(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?"
}

interface Props {
  list?: AwaitingPayoutItem[]
  isLoading: boolean
  currency?: string
}

export function AwaitingPayoutsTable({ list, isLoading, currency }: Props) {
  const releaseMutation = useReleasePayout()

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="p-5 border-b border-border">
        <h2 className="font-bold text-lg">Awaiting Payouts</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-[16px] font-space text-muted-foreground uppercase">
              <th className="py-4 px-6 font-medium">ORGANIZERS</th>
              <th className="py-4 px-6 font-medium">EVENT</th>
              <th className="py-4 px-6 font-medium">AMOUNT</th>
              <th className="py-4 px-6 font-medium">RELEASE DATE</th>
              <th className="py-4 px-6 font-medium">STATUS</th>
              <th className="py-4 px-6 font-medium text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                  Loading awaiting payouts...
                </td>
              </tr>
            )}

            {!isLoading && list?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                  No payouts currently awaiting release.
                </td>
              </tr>
            )}

            {list?.map((item) => {
              const isReleasing =
                releaseMutation.isPending &&
                releaseMutation.variables?.organizerId === item.organizerId &&
                releaseMutation.variables?.eventId === item.eventId

              return (
                <tr key={`${item.organizerId}-${item.eventId}`} className="hover:bg-muted/30">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        {initialsFor(item.organizerName)}
                      </div>
                      <span className="font-[600] text-[17px] font-geist">{item.organizerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground text-[16px] font-geist font-[400]">{item.eventTitle}</td>
                  <td className="py-4 px-6 font-space font-[700] text-[20px]">{formatExactCurrency(item.amount, currency)}</td>
                  <td className="py-4 px-6 text-muted-foreground font-geist text-[16px] font-[400]">{formatDate(item.releaseDate)}</td>
                  <td className="py-4 px-6">
                    {item.status === "ready" && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-0.5 rounded-full text-[16px] font-[700] font-space bg-[#FCD98A] text-[#7A4E02] dark:bg-[#D97706]/20 dark:text-[#FBBF24]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7A4E02] dark:bg-[#FBBF24]" />
                        READY
                      </span>
                    )}
                    {item.status === "held" && (
                      <span className="inline-flex items-center gap-1.5  px-4 py-0.5 rounded-full text-[16px] font-[700] font-space bg-[#E6F8ED] text-[#008134] dark:bg-[#16A34A]/20 dark:text-[#4ADE80]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008134] dark:bg-[#4ADE80]" />
                        HELD
                      </span>
                    )}
                    {item.status === "processing" && (
                      <span className="inline-flex items-center gap-1.5   px-4 py-0.5 font-[700] font-space rounded-full m text-[11px] font-bold bg-muted text-muted-foreground">
                        PROCESSING
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.status === "ready" && (
                      <ActionBtn
                        type="button"
                        text="Release"
                        loading={isReleasing}
                        disabled={releaseMutation.isPending}
                        onClick={() =>
                          releaseMutation.mutate({
                            organizerId: item.organizerId,
                            eventId: item.eventId,
                          })
                        }
                        classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-xs px-4 py-1.5 h-auto rounded-md font-medium"
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
