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
                <div>
                    <p className="text-sm min-[400px]:text-[18px] font-grotesk font-medium uppercase text-[#0A4F41]">
                      Platform
                    </p>
                    <h1 className="text-2xl min-[400px]:text-[34px] font-semibold text-[#000000] font-grotesk mt-1">
                        Revenue
                    </h1>
                    <p className="text-sm min-[400px]:text-[18px] text-[#4A4451] mt-1">
                     Where Eventra's earnings come from, over time
                    </p>
                </div>
             <div className="py-2 min-[400px]:py-10 w-full min-[400px]:w-auto">
                   <Button variant="outline" 
                className="gap-1.5 border-[#E8E6E0] py-3 min-[400px]:py-[18px] text-sm min-[400px]:text-[15px] font-bold text-[#1A1523] w-full min-[400px]:w-auto"
                disabled={!data}
                onClick={() => data && exportRevenueCsv(data)}>
                    <Download className="size-4" />
                     Export CSV
                </Button>
             </div>
            </div>

        <div className="grid grid-cols-1 pt-6 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            <div className="border border-[#E8E6E0] rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-[#6E6577] font-space">
                  Platform Revenue
                </p>
                {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold leading-tight min-[400px]:leading-[38px] tracking-wide text-[#000000] mt-2 font-space">
              {formatCompactNaira(data.summary.platformRevenue, data.currency)}
            </p>
          )}
          {
            data?.summary.platformRevenueChangePct !== null && data && (
                <p className="text-xs min-[400px]:text-[15px] text-[#0F6E56] mt-2 font-space">
                   ▲ {data.summary.platformRevenueChangePct}% <span className="text-xs min-[400px]:text-[16px] font-geist text-[#6E6577]">This month</span>
                </p>
            )
          }
            </div>

            <div className="border border-[#E8E6E0] rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-[#6E6577] font-space">
                   Commission ({data?.summary.commissionRatePct ?? "..."}%)
                </p>
                 {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-[#000000] leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.commission, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-[#6E6577] mt-2">
            From ticket sales
          </p>
            </div>

            <div className="border border-[#E8E6E0] rounded-[10px] p-3 min-[400px]:p-[14px]">
                <p className="text-xs min-[400px]:text-[16px] uppercase text-[#6E6577] font-space">
                   Promotions
                </p>
                {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-[#000000] leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.promotions, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-[#6E6577] mt-2">
            Featured placement
          </p>
            </div>

        <div className="border border-[#E8E6E0] rounded-[10px] p-3 min-[400px]:p-[14px]">
            <p className="text-xs min-[400px]:text-[16px] uppercase text-[#6E6577] font-space">
              Gross Ticket Sales
            </p>
             {isLoading || !data ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className="text-xl min-[400px]:text-[34px] font-bold text-[#000000] leading-tight min-[400px]:leading-[38px] tracking-wide mt-2 font-space">
               {formatCompactNaira(data.summary.grossTicketSales, data.currency)}
            </p>
          )}
          <p className="text-xs min-[400px]:text-[16px] text-[#6E6577] mt-2">
            Platform GMV
          </p>
        </div>
        </div>
        {
            !isLoading && data && (
                 <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 pt-6 items-stretch min-w-0">
                <div className="lg:col-span-2">
                      <RevenueBySourceChart
                data={data.revenueBySource}
                total={data.summary.platformRevenue} />
                </div>

                <div className="lg:col-span-3">
                   <TopEarningEventsTable
                    events={data.topEarningEvents}/>
                </div>
              </div>

              <div className="pt-8 min-[400px]:pt-15">
                <MonthlyBreakdownTable rows={data.monthlyBreakdown}/>
              </div>
              </>
            )}

        </div>
    )
}
