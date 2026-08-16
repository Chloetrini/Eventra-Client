import type { Event } from './event'

export type AccountStatus = 'pending' | 'verified' | 'suspended'
export type PayoutSetupStatus = 'not_started' | 'pending' | 'complete'
export type EarningStatus = 'held' | 'ready' | 'free'
export type PayoutHistoryStatus = 'paid' | 'pending' | 'failed'

export interface TierSale {
  tierId: number
  tierName: string
  price: number
  quantitySold: number
}

export interface PayoutStats {
  ticketsSoldChangePercent: number
  revenueChangePercent: number
  nextPayoutDays: number
}

export interface EventEarning {
  id: number
  eventId: Event[]
  eventName: string
  eventNumber: string     
  eventCategory: Event['category']
  coverImageUrl: string | null
  isFree: boolean
  status: EarningStatus
  tierSales: TierSale[]
}

export interface PayoutHistoryItem {
  id: number
  date: string                 // ISO 8601
  amount: number
  bankName: string
  accountNumber: string
  status: PayoutHistoryStatus
}

export interface PayoutsPageData {
  accountStatus: AccountStatus
  payoutSetupStatus: PayoutSetupStatus
  commissionPercent: number
  stats: PayoutStats
  earnings: EventEarning[]
  payoutHistory: PayoutHistoryItem[]
  organization: {
    name: string;
    logo?: string | null;
  };
}
