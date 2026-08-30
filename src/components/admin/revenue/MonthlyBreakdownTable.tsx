import { formatCompactNaira } from "@/lib/utils";
import type { MonthlyBreakdownRow } from "@/types/revenue";


interface MonthlyBreakdownTableProps {
    rows: MonthlyBreakdownRow[];
    // Every amount here is already converted server-side into the
    // viewer's currency (see RevenuePageData.currency) — optional so an
    // older cached response without it still falls back to Naira.
    currency?: string;
}

export default function MonthlyBreakdownTable ({rows, currency} : MonthlyBreakdownTableProps) {
    return (
        <div className="border rounded-lg overflow-x-auto min-w-0">
            <div className="px-4 min-[400px]:px-6 py-3 min-[400px]:py-4 border-b">
                <h2 className="text-xl min-[400px]:text-[34px] font-bold text-[#000000] font-grotesk">
                 Monthly breakdown         
                </h2>
            </div>
            <table className="w-full min-w-[500px]">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 min-[400px]:px-8 font-grotesk text-[#6E6577] font-light text-xs min-[400px]:text-[22px]">Month</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-8 font-grotesk text-[#6E6577] text-xs min-[400px]:text-[22px] font-light uppercase">Gross Sales</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-8 font-grotesk text-[#6E6577] text-xs min-[400px]:text-[22px] font-light uppercase">Commission</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-8 font-grotesk text-[#6E6577] text-xs min-[400px]:text-[22px] font-light uppercase">Promotion</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-8 font-grotesk text-[#6E6577] text-xs min-[400px]:text-[22px] font-light uppercase">Total</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => (
                        <tr key={row.month} className="border-b last:border-b-0">
                            <td className="py-3 min-[400px]:py-5 px-4 min-[400px]:px-8 text-xs min-[400px]:text-[18px] font-bold text-[#000000]">{row.month}</td>
                            <td className="px-4 min-[400px]:px-8 text-[#000000] text-xs min-[400px]:text-[18px] font-bold">
                                {formatCompactNaira(row.grossSales, currency)}
                            </td>
                            <td className="px-4 min-[400px]:px-8 text-[#000000] text-xs min-[400px]:text-[18px] font-bold">
                                {formatCompactNaira(row.commission, currency)}
                            </td>
                            <td className="px-4 min-[400px]:px-8 text-[#000000] text-xs min-[400px]:text-[18px] font-bold">
                                {formatCompactNaira(row.promotion, currency)}
                            </td>
                            <td className="px-4 min-[400px]:px-8 text-[#000000] text-xs min-[400px]:text-[18px] font-bold">
                                {formatCompactNaira(row.total, currency)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
