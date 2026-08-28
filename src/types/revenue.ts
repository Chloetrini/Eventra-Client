export interface RevenueSummary {
    platformRevenue: number;
    platformRevenueChangePct: number | null ;
    commission: number;
    commissionRatePct: number;
    promotions: number;
    grossTicketSales: number
}

export interface RevenueBySource {
    label: string;
    amount: number;
    percent: number
}

export interface TopEarningEvent {
    id: string;
    eventTitle: string;
    organizer: string;
    commission: number
}

export interface MonthlyBreakdownRow{
    month: string;
    grossSales: number;
    commission: number;
    promotion: number;
    total: number
}

export interface RevenuePageData {
    summary: RevenueSummary;
    revenueBySource: RevenueBySource[];
    topEarningEvents: TopEarningEvent[];
    monthlyBreakdown: MonthlyBreakdownRow[]
}