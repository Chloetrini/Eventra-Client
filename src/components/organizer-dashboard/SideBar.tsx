import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import EventraLogo from '/src/assets/Eventra-logo.png';
import { useUnreadNotificationCount } from '@/hooks/use-notifications';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  Wallet,
  Megaphone,
  Settings,
  Home,
  ChevronDown,
  X
} from 'lucide-react';

// countKey groups map a nav item to the unread-notification types that are
// actually about it — e.g. "Events" badges up when an event of yours was
// approved/rejected. Not every item has a natural notification type
// (Overview, Check-in, Payouts aren't things you get notified about), so
// those are simply left without a countKey and never show a badge.
const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/overview' },
  { icon: Calendar, label: 'Events', path: '/dashboard/events', countKey: 'events' as const },
  { icon: Users, label: 'Attendees', path: '/dashboard/attendees', countKey: 'attendees' as const },
  { icon: CheckSquare, label: 'Check-in', path: '/dashboard/check-in' },
  { icon: Wallet, label: 'Payouts', path: '/dashboard/payouts' },
  { icon: Megaphone, label: 'Promotions', path: '/dashboard/promotion', countKey: null },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  { icon: Home, label: 'Back to site', path: '/' },
];

interface SideBarProps {
  organization: {
    name: string;
    logo?: string | null;
  };
  // Below the `lg` breakpoint the sidebar renders as an off-canvas drawer
  // instead of a permanent column — isOpen/onClose control that drawer.
  // Both are optional so any other caller can keep rendering the desktop
  // (always-visible) sidebar without wiring up the mobile state.
  isOpen?: boolean;
  onClose?: () => void;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Plain unread-count pill — same shape/size as the admin sidebar's
// NavCountBadge, but always the brand green rather than amber/red, since
// these aren't a "backlog to clear," just unseen updates.
function NavCountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F6E56]/15 px-1.5 text-[11px] font-bold text-[#0F6E56] dark:bg-[#4ADE80]/15 dark:text-[#4ADE80]">
      {count}
    </span>
  );
}

const SideBar: React.FC<SideBarProps> = ({ organization, isOpen = false, onClose }) => {
  const location = useLocation();
  const orgInitials = getInitials(organization?.name);
  const navigate = useNavigate();

  // Same GET /notifications/unread-count the topbar bell uses — grouped
  // here into per-nav-item counts instead of one total.
  const { data: unread } = useUnreadNotificationCount();
  const byType = unread?.byType ?? {};
  const navCounts: Record<'events' | 'attendees' | 'promotions', number> = {
    events: (byType.event_approved ?? 0) + (byType.event_rejected ?? 0),
    attendees: byType.new_sale ?? 0,
    promotions: (byType.promotion_approved ?? 0) + (byType.promotion_rejected ?? 0),
  };

  return (
    <>
      {/* Mobile backdrop — only rendered (and only intercepts clicks) while the drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[295px] bg-card border-r border-border flex flex-col h-screen transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Logo Section — the drawer is a fixed w-64 (256px), and on the
          mobile off-canvas drawer that same width also has to fit the
          Close button that desktop doesn't render. "Eventra" + the
          ORGANIZER badge + the close button no longer fit on one line at
          that width, so they were overlapping. flex-wrap lets the badge
          drop to its own line instead of overlapping the close button,
          and the tightened gaps/padding buy back a bit more room besides. */}
      <div className="flex items-start justify-between gap-2 px-4 sm:px-3 pt-6 pb-4">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <div className='flex flex-row items-center gap-1 shrink-0'>
            <Link
              to="/"
              onClick={() => navigate('/')}
              className='flex items-center gap-1.5'
            >
              <img src={EventraLogo} alt="Eventra Logo" className="h-8 w-8 shrink-0" />
              <span className="text-2xl font-grotesk font-bold text-foreground truncate">Eventra</span>
            </Link>
          </div>
          <div className="bg-[#BBE0CF] dark:bg-[#0F6E56]/15 px-2 py-0.5 rounded-[6px] shrink-0">
            <p className="font-space text-[10px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wider">
              ORGANIZER
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground p-1"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Organization Selector */}
      <div className="px-4 pb-4 border-b border-border">
        <button className="flex items-center justify-between w-full bg-muted hover:bg-accent border border-border rounded-lg px-3 py-2.5 transition-colors">
          <div className="flex items-center gap-3">
            {organization?.logo ? (
              <img
                src={organization.logo}
                alt={organization.name}
                className="h-5 w-5 rounded object-cover"
              />
            ) : (
              <div className="h-5 w-5 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">
                {orgInitials}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">
              {organization?.name || "Organization"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Manage</p>
        {navItems.map((item) => {
          if (!item.path) {
            // Placeholder item — no page built yet, so it's styled and looks
            // exactly like a normal nav item, but it isn't a real link yet.
            return (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  {item.label}
                </div>
              </div>
            );
          }
          const isActive = location.pathname === item.path;
          const count = item.countKey ? navCounts[item.countKey] : undefined;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#EBF8F1] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]'
                  : 'text-muted-foreground hover:bg-accent'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-[#0F6E56] dark:text-[#4ADE80]' : 'text-muted-foreground'}`} />
                {item.label}
              </div>
              {count !== undefined && <NavCountBadge count={count} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border px-4 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Account</p>
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
      </aside>
    </>
  );
};

export default SideBar;
