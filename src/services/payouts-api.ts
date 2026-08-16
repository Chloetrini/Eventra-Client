import { api } from "@/services/api";

export type PayoutEventStatus = "held" | "ready" | "paid" | "free_no_payout";

export type EarningsByEventRow = {
  eventId: string;
  eventTitle: string;
  grossSales: number;
  commission: number;
  earnings: number;
  status: PayoutEventStatus;
};

export type PayoutHistoryRow = {
  date: string;
  amount: number;
  bankLabel: string | null;
  status: "paid";
};

export type PayoutsData = {
  earningsByEvent: EarningsByEventRow[];
  payoutHistory: PayoutHistoryRow[];
};

export async function fetchPayouts(): Promise<PayoutsData> {
  const res = await api.get("/organizers/payouts");
  return res.body as PayoutsData;
}
