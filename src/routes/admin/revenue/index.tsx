import { useRevenue } from "@/hooks/use-revenue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { formatCompactNaira } from "@/lib/utils";
import RevenueBySourceChart from "@/components/admin/revenue/RevenueBySourceChart";
import TopEarningEventsTable from "@/components/admin/revenue/TopEarningEventsTable";
import MonthlyBreakdownTable from "@/components/admin/revenue/MonthlyBreakdownTable";
import { exportRevenueCsv } from "@/lib/export-revenue-csv";


export default function AdminRevenuePage() {
    const { data, isLoading, isError} = useRevenue ();

    if (isError) {
        return(
            <p className="text-center py-12 text-sm text-red-500">
                Something went wrong loading revenue data.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-4 pt-8 sm:px-6 lg:px-8 py-6 min-w-0">
            <div className="flex flex-col min-[400px]:flex-row items-start justify-between gap-4">
                {/* This whole page (and RevenueBySourceChart/TopEarningEventsTable/
                    MonthlyBreakdownTable below) hardcoded near-black/dark-gray hex
                    text colors and a light-gray hex border with no dark: variant
                    anywhere — fine against a white background, but in dark mode
                    it inherits the dark page background and the text becomes
                    almost unreadable (dark text on a dark surface). Swapped every
                    hardcoded text/border color for the theme-aware tokens
                    (text-foreground / text-muted-foreground / border-border)
                    already used correctly elsewhere in the admin console, so
                    both modes render properly. */}
                <div>
                    <p className="text-sm min-[400px]:text-[18px] font-grotesk font-medium uppercase text-[#0A4F41] dark:text-[#4ADE80]">
                      Platform
                    </p>
                    <h1 className="text-2xl min-[400px]:text-[34px] font-semibold text-foreground font-grotesk mt-1">
                        Revenue
                    </h1>
                    <p className="text-sm min-[400px]:text-[18px] text-muted-foreground mt-1">
                     Where Eventra's earnings come from, over time
                    </p>
                </div>
             <div className="py-2 min-[400px]:py-10 w-full min-[400px]:w-auto">
                   <Button variant="outline"
                className="gap-1.5 border-border py-3 min-[400px]:py-[18px] text-sm min-[400px]:text-[15px] font-bold text-foreground w-full min-[400px]:w-auto"
                disabled={!data}
                onClick={() => data && exportRevenueCsv(data)}>
                    <Download className="size-4" />
                     Export CSV
                </Button>
             </div>
            </div>

        <div className="grid grid-cols-1 pt-6 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            <div className="border border-border rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-muted-foreground font-space">
                  Platform Revenue
                </p>
                {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold leading-tight min-[400px]:leading-[38px] tracking-wide text-foreground mt-2 font-space">
              {formatCompactNaira(data.summary.platformRevenue, data.currency)}
            </p>
          )}
          {
            data?.summary.platformRevenueChangePct !== null && data && (
                <p className="text-xs min-[400px]:text-[15px] text-[#0F6E56] dark:text-[#4ADE80] mt-2 font-space">
                   ▲ {data.summary.platformRevenueChangePct}% <span className="text-xs min-[400px]:text-[16px] font-geist text-muted-foreground">This month</span>
                </p>
            )
          }
            </div>

            <div className="border border-border rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-muted-foreground font-space">
                   Commission ({data?.summary.commissionRatePct ?? "..."}%)
                </p>
                 {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-foreground leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.commission, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-muted-foreground mt-2">
            From ticket sales
          </p>
            </div>

            <div className="border border-border rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-muted-foreground font-space">
                   Promotions
                </p>
                {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-foreground leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.promotions, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-muted-foreground mt-2">
            Featured placement
          </p>
            </div>

        <div className="border border-border rounded-[10px] p-3 min-[400px]:p-[14px]">
            <p className="text-xs min-[400px]:text-[16px] uppercase text-muted-foreground font-space">
              Gross Ticket Sales
            </p>
             {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-foreground leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.grossTicketSales, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-muted-foreground mt-2">
            Platform GMV
          </p>
        </div>
        </div>
        {
            !isLoading && data && (
                 <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 pt-6 items-stretch min-w-0">
                <div className="lg:col-span-2">
                      {/* data.currency wasn't being passed to any of these
                          three below — each one defaults its own currency
                          prop to Naira when it's undefined (see
                          formatNaira/formatCompactNaira in lib/utils.ts),
                          so an admin whose platform currency is Dollar (or
                          anything else) still saw a hardcoded ₦ in Revenue
                          by source, Top earning events, and Monthly
                          breakdown even though the four summary cards above
                          — which already passed data.currency — showed the
                          right symbol. */}
                      <RevenueBySourceChart
                data={data.revenueBySource}
                total={data.summary.platformRevenue}
                currency={data.currency} />
                </div>

                <div className="lg:col-span-3">
                   <TopEarningEventsTable
                    events={data.topEarningEvents}
                    currency={data.currency}/>
                </div>
              </div>

              <div className="pt-8 min-[400px]:pt-15">
                <MonthlyBreakdownTable rows={data.monthlyBreakdown} currency={data.currency}/>
              </div>
              </>
            )}

        </div>
    )
}
