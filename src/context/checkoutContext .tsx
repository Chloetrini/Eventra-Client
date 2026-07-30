// import { createContext, useContext, useState, type ReactNode } from 'react'
// import type { Event, TicketTier } from '@/types/event'

// export interface SelectedTier {
//   tier: TicketTier
//   quantity: number
// }

// export interface CheckoutState {
//   event: Pick<Event, 'id' | 'name' | 'startDate' | 'location' | 'coverImageUrl' | 'serviceFeePercent'> | null
//   selectedTiers: SelectedTier[]
//   subtotal: number
//   serviceFee: number
//   total: number
// }

// interface CheckoutContextValue {
//   checkout: CheckoutState
//   setCheckout: (state: CheckoutState) => void
//   clearCheckout: () => void
// }


// const DEFAULT_STATE: CheckoutState = {
//   event: null,
//   selectedTiers: [],
//   subtotal: 0,
//   serviceFee: 0,
//   total: 0,
// }

// const CheckoutContext = createContext<CheckoutContextValue | null>(null)

// export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
//   const [checkout, setCheckoutState] = useState<CheckoutState>(DEFAULT_STATE)

//   const setCheckout = (state: CheckoutState) => {
//     setCheckoutState(state)
//   }

//   const clearCheckout = () => {
//     setCheckoutState(DEFAULT_STATE)
//   }

//   return (
//     <CheckoutContext.Provider value={{ checkout, setCheckout, clearCheckout }}>
//       {children}
//     </CheckoutContext.Provider>
//   )
// }


// export const useCheckout = () => {
//   const ctx = useContext(CheckoutContext)
//   if (!ctx) throw new Error('useCheckout must be used inside CheckoutProvider')
//   return ctx
// }