import { Lock, CalendarCheck, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  {
    icon: Lock,
    title: "Held in escrow",
    description:
      "Ticket money is held safely from the moment of purchase, protecting both you and your attendees.",
  },
  {
    icon: CalendarCheck,
    title: "Released after the event",
    description: "A few days after each event, your earnings become available for payout.",
  },
  {
    icon: Building2,
    title: "Paid to your bank",
    description: "We send the balance, minus the 5% commission, to your verified Paystack bank account.",
  },
];

export function HowPayoutsWork() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-[18px] sm:text-[20px] font-grotesk font-semibold text-foreground">
        How payouts work
      </h2>
      <Separator className="mt-3" />
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4F1EB] dark:bg-[#0F6E56]/15">
              <step.icon className="h-5 w-5 text-[#0A4F41] dark:text-[#4ADE80]" />
            </div>
            <div>
              <p className="text-sm font-bold font-grotesk text-foreground">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
