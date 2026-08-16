import React from 'react';
import { TrendingUp, TrendingDown, Ticket, Coins, Eye, Clock } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, change, subtext }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6 relative">
      <div className="absolute top-5 right-5 h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80]">
        {icon}
      </div>

      <p className="text-xs font-bold font-space text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
      <p className="text-3xl font-bold font-space text-foreground mt-2">{value}</p>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium">
        {change !== undefined && (
          <span className={`flex items-center gap-1 ${isPositive ? 'text-[#0F6E56] dark:text-[#4ADE80]' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        )}
        <span className={`text-muted-foreground ${change !== undefined ? 'font-normal' : ''}`}>
          {change !== undefined ? 'vs last month' : subtext}
        </span>
      </div>
    </div>
  );
};

interface StatsCardsProps {
  stats?: {
    ticketsSold: { value: string; change: number; subtext: string };
    revenue: { value: string; change: number; subtext: string };
    liveEvents: { value: string; subtext: string };
    payoutDue: { value: string; subtext: string };
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  // Fallback if stats are undefined
  const safeStats = stats || {
    ticketsSold: { value: '0', change: 0, subtext: '' },
    revenue: { value: '0', change: 0, subtext: '' },
    liveEvents: { value: '0', subtext: '' },
    payoutDue: { value: '0', subtext: '' },
  };

  const cards = [
    { 
      label: 'TICKETS SOLD', 
      value: safeStats.ticketsSold.value, 
      icon: <Ticket className="h-4 w-4" />, 
      change: safeStats.ticketsSold.change, 
      subtext: safeStats.ticketsSold.subtext 
    },
    { 
      label: 'REVENUE', 
      value: safeStats.revenue.value, 
      icon: <Coins className="h-4 w-4" />, 
      change: safeStats.revenue.change, 
      subtext: safeStats.revenue.subtext 
    },
    { 
      label: 'LIVE EVENTS', 
      value: safeStats.liveEvents.value, 
      icon: <Eye className="h-4 w-4" />, 
      subtext: safeStats.liveEvents.subtext 
    },
    { 
      label: 'PAYOUT DUE', 
      value: safeStats.payoutDue.value, 
      icon: <Clock className="h-4 w-4" />, 
      subtext: safeStats.payoutDue.subtext 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;