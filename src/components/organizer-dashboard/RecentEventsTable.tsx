import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { EventActionsMenu } from '@/components/event-actions-menu';

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  // Raw ISO start date — needed by EventActionsMenu to know whether a
  // live event is still inside the edit cutoff window.
  startDate: string;
  sold: string;
  status: 'Live' | 'Sold out' | 'Draft' | 'Pending' | 'Past' | 'Rejected' | 'Cancelled' | 'Postponed';
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
  'Pending': 'bg-[#DCEAFB] text-[#1D4ED8] dark:bg-[#1D4ED8]/20 dark:text-[#93C5FD]',
  'Past': 'bg-muted text-muted-foreground',
  'Rejected': 'bg-[#FFC4C4] text-[#BE2525] dark:bg-[#BE2525]/20 dark:text-[#FF8A8A]',
  'Cancelled': 'bg-[#FFC4C4] text-[#BE2525] dark:bg-[#BE2525]/20 dark:text-[#FF8A8A]',
  'Postponed': 'bg-[#FDE4C8] text-[#9A3412] dark:bg-[#9A3412]/25 dark:text-[#FDE4C8]',
};

const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ events, onViewAll }) => {
  const navigate = useNavigate();

  if (!events || events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-grotesk font-semibold text-foreground">Recent events</h3>
        </div>
        <div className="text-center py-12 text-muted-foreground">No recent events to display.</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-grotesk font-semibold text-foreground">Recent events</h3>
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
          <thead className="text-muted-foreground text-xs font-medium font-space tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-3 font-space">EVENT</th>
              <th className="px-6 py-3 font-space">DATE</th>
              <th className="px-6 py-3 font-space">SOLD</th>
              <th className="px-6 py-3 font-space">STATUS</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr
                key={event.id}
                onClick={() => navigate(`/dashboard/events/${event.id}`)}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
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
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-space uppercase tracking-wide ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <EventActionsMenu eventId={event.id} eventTitle={event.title} status={event.status} startDate={event.startDate} />
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
