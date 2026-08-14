import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EventActionsMenu } from '@/components/event-actions-menu';

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  sold: string;
  status: 'Live' | 'Sold out' | 'Draft' | 'Past';
  imageUrl?: string;
}

interface RecentEventsTableProps {
  events: Event[];
  onViewAll?: () => void;
}

const statusColors = {
  'Live': 'bg-[#E6F6F0] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]',
  'Sold out': 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
  'Draft': 'bg-muted text-muted-foreground',
  'Past': 'bg-muted text-muted-foreground',
};

const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ events, onViewAll }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Recent events</h3>
        </div>
        <div className="text-center py-12 text-muted-foreground">No recent events to display.</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Recent events</h3>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-[#0F6E56] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-muted-foreground text-xs font-medium tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-3">EVENT</th>
              <th className="px-6 py-3">DATE</th>
              <th className="px-6 py-3">SOLD</th>
              <th className="px-6 py-3">STATUS</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-accent transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted shrink-0 overflow-hidden">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">Img</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{event.title}</span>
                      <span className="text-xs text-muted-foreground">{event.subtitle || 'No details'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground font-medium">{event.date}</td>
                <td className="px-6 py-4 text-muted-foreground font-medium">{event.sold}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <EventActionsMenu eventId={event.id} eventTitle={event.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEventsTable;