import type { RevenuePageData } from "@/types/revenue";

export const mockRevenueData: RevenuePageData = {
    summary: {
         platformRevenue: 4_900_000,
    platformRevenueChangePct: 6,
    commission: 3_800_000,
    commissionRatePct: 5,
    promotions: 1_100_000,
    grossTicketSales: 84_200_000,
    },
    revenueBySource: [
        { label: "Promotions", amount: 1_100_000, percent: 78 },
        { label: "Commission", amount: 3_800_000, percent: 22 },
    ],
    topEarningEvents: [
        {
      id: "ev1",
      eventTitle: "Detty December Boat Party",
      organizer: "PartyVerse NG",
      commission: 500_000,
    },
    {
      id: "ev2",
      eventTitle: "Afrobeats Night Market",
      organizer: "LagosLive Co.",
      commission: 234_000,
    },
    {
      id: "ev3",
      eventTitle: "Owambe Saturday",
      organizer: "NaijaComedy Co.",
      commission: 126_000,
    },
    {
      id: "ev4",
      eventTitle: "Comedy Central Live",
      organizer: "NaijaComedy Co.",
      commission: 72_000,
    },
    ],
    monthlyBreakdown: [
    { month: "Sep", grossSales: 9_200_000, commission: 466_000, promotion: 120_000, total: 500_000 },
    { month: "Oct", grossSales: 1_400_000, commission: 576_000, promotion: 100_000, total: 750_000 },
    { month: "Nov", grossSales: 13_800_000, commission: 699_000, promotion: 240_000, total: 930_000 },
    { month: "Dec", grossSales: 21_600_000, commission: 1_380_000, promotion: 420_000, total: 1_500_000 },
    { month: "Jan", grossSales: 16_200_000, commission: 816_000, promotion: 300_000, total: 1_110_000 },
    { month: "Feb", grossSales: 12_600_000, commission: 600_000, promotion: 110_000, total: 710_000 }, 
    ]
}