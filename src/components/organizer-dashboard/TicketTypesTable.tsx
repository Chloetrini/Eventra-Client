import React from 'react';
import type { TicketTypeDetail } from '@/types/organizer-event';

interface TicketTypesTableProps {
  ticketTypes: TicketTypeDetail[];
  onEdit?: () => void;
}

function formatPrice(price: number): string {
  if (price === 0) return 'FREE';
  return `₦${price.toLocaleString('en-US')}`;
}

export default function TicketTypesTable({
  ticketTypes,
  onEdit,
}: TicketTypesTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground font-geist">
          Ticket types
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-[#15803d] hover:underline dark:text-[#4ADE80]"
        >
          Edit
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[12px] font-space text-muted-foreground uppercase tracking-wider font-normal">
              <th className="py-3 px-5 font-space">TYPE</th>
              <th className="py-3 px-5 font-space">PRICE</th>
              <th className="py-3 px-5 font-space">SOLD</th>
              <th className="py-3 px-5 font-space">LEFT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs font-mono font-bold text-foreground">
            {ticketTypes.map((tier) => (
              <tr key={tier.slug} className="hover:bg-muted/50">
                <td className="py-4 px-5 uppercase font-geist font-normal">{tier.name}</td>
                <td className="py-4 px-5 uppercase">{formatPrice(tier.price)}</td>
                <td className="py-4 px-5">
                  {tier.sold !== null ? tier.sold : '--'}
                </td>
                <td className="py-4 px-5">
                  {tier.left !== null ? tier.left : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
