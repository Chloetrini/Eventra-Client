import { Lock, CalendarCheck, Building2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export const HowPayoutsWork = () => {
  const steps = [
    {
      icon: <Lock className="h-6 w-6 text-[#0A4F41]" />,
      title: 'Held in escrow',
      description: 'Ticket money is held safely from the moment of purchase, protecting both you and your attendees',
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-[#0A4F41]" />,
      title: 'Released after the event',
      description: 'A few days after each event, your earnings become available for payout.',
    },
    {
      icon: <Building2 className="h-6 w-6 text-[#0A4F41]"/>,
      title: 'Paid to your bank',
      description: 'We send the balance, minus the 5% commission, to your verified Paystack bank account.',
    },
  ]

  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-[20px] font-grotesk text-[#1A1523] font-semibold">How payouts work</h2>
      <Separator className='h-px mt-3 bg-[#E8E6E0]'/>
      <div className="mt-3 grid grid-cols-1 gap-25 sm:grid-cols-3">
        {steps.map((step) => (
          <div className="flex items-center gap-3 ">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4F1EB]">
              {step.icon}
            </div>
            <div>
              <p className="text-sm font-bold font-grotesk">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#4A4451]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}