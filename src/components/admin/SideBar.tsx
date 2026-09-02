import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import EventraLogo from '/src/assets/Eventra-logo.png';
import { useAuth } from '@/context/auth.context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useAdminNavCounts } from '@/hooks/useAdminNavCounts';
import {
  LayoutDashboard,
  ClipboardCheck,
  Undo2,
  FileWarning,
  Calendar,
  Building2,
  Users,
  Star,
  TrendingUp,
  Wallet,
  Settings,
  Home,
  X,
} from 'lucide-react';

// The single top-level item — sits above the sectioned nav, no header
// label above it (matches the Figma: "Overview" is its own row, not
// grouped under "Needs Action" the way Approvals/Refunds/Reports are).
const overviewItem = {
  icon: LayoutDashboard,
  label: 'Overview',
  path: '/admin/overview',
};

// "Needs Action" items carry a live count badge — these are things an
// admin has to clear, not just navigate to, so the count is part of the
// nav item itself rather than something you only see after clicking in.
const needsActionItems = [
  { icon: ClipboardCheck, label: 'Approvals', path: '/admin/approvals', countKey: 'pendingApprovals' as const },
  { icon: Undo2, label: 'Refunds', path: '/admin/refunds', countKey: 'pendingRefunds' as const },
  { icon: FileWarning, label: 'Reports', path: '/admin/reports', countKey: 'flaggedReports' as const, urgent: true },
];

const manageItems = [
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: Building2, label: 'Organizers', path: '/admin/organizers' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Star, label: 'Promotions', path: '/admin/promotions' },
];

const platformItems = [
  { icon: TrendingUp, label: 'Revenue', path: '/admin/revenue' },
  { icon: Wallet, label: 'Payouts', path: '/admin/payouts' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

interface AdminSideBarProps {
  // Below the `lg` breakpoint the sidebar renders as an off-canvas drawer
  // instead of a permanent column — isOpen/onClose control that drawer.
  // Both are optional so a caller can still render the desktop
  // (always-visible) sidebar without wiring up mobile state.
  isOpen?: boolean;
  onClose?: () => void;
}

// Small pill used on "Needs Action" nav items. Amber for a normal pending
// count, red (destructive) when that item has anything flagged/urgent —
// same red/amber split the Overview page's Needs Action cards use, so the
// color means the same thing everywhere in the admin console.
function NavCountBadge({ count, urgent }: { count: number; urgent?: boolean }) {
  if (!count) return null;
  return (
    <span
      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
        urgent
          ? 'bg-destructive/15 text-destructive'
          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
      }`}
    >
      {count}
    </span>
  );
}

function NavSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

const SideBar: React.FC<AdminSideBarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Live counts from GET /admin/nav-counts (see hooks/useAdminNavCounts.ts)
  // — Approvals/Refunds reflect the actual pending backlog. "Reports" has
  // no backing data model yet, so it always comes back 0 until that exists.
  const { data: counts } = useAdminNavCounts();

  const isActive = (path: string) => location.pathname === path;

  const renderItem = (item: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
    countKey?: 'pendingApprovals' | 'pendingRefunds' | 'flaggedReports';
    urgent?: boolean;
  }) => {
    const active = isActive(item.path);
    const count = item.countKey ? counts?.[item.countKey] : undefined;

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-[#EBF8F1] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]'
            : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon
            className={`h-5 w-5 ${active ? 'text-[#0F6E56] dark:text-[#4ADE80]' : 'text-muted-foreground'}`}
          />
          {item.label}
        </div>
        {count !== undefined && <NavCountBadge count={count} urgent={item.urgent} />}
      </Link>
    );
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border h-screen flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo section — same flex-wrap treatment as the organizer sidebar:
            "Eventra" + the ADMIN badge + the mobile close button don't all
            fit on one line at w-64, so the badge is free to wrap to its own
            line instead of overlapping the close button. */}
        <div className="flex items-start justify-between gap-2 px-4 sm:px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <div className="flex flex-row items-center gap-1 shrink-0">
              <Link
                to="/"
                onClick={() => navigate('/')}
                className='flex items-center gap-1.5'
              >
                <img src={EventraLogo} alt="Eventra Logo" className="h-8 w-8 shrink-0" />
                <span className="text-2xl font-grotesk font-bold text-foreground truncate">Eventra</span>
              </Link>
              
            </div>
            <div className="bg-[#FBE4C6] dark:bg-[#C97A17]/15 px-2 py-0.5 rounded-[6px] shrink-0">
              <p className="font-space text-[10px] font-bold text-[#C97A17] dark:text-[#B87D25] uppercase tracking-wider">
                ADMIN
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

        {/* Admin console / current user — static, not a selector like the
            organizer sidebar's org switcher (an admin isn't switching
            between orgs), so no chevron / dropdown affordance here. */}
        <div className="px-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
            <UserAvatar avatarUrl={user?.avatarUrl} name={user?.fullname} className="h-8 w-8 rounded-[6px] text-xs shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                Admin Console
              </p>
              {/* Falls back to "Operations" until roles are modeled on the
                  user object — every admin in the Figma shows a role label
                  under their name. */}
              <p className="truncate text-xs text-muted-foreground">OPERATIONS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">{renderItem(overviewItem)}</div>

          <div>
            <NavSectionLabel>Needs Action</NavSectionLabel>
            <div className="space-y-1">{needsActionItems.map(renderItem)}</div>
          </div>

          <div>
            <NavSectionLabel>Manage</NavSectionLabel>
            <div className="space-y-1">{manageItems.map(renderItem)}</div>
          </div>

          <div>
            <NavSectionLabel>Platform</NavSectionLabel>
            <div className="space-y-1">{platformItems.map(renderItem)}</div>
          </div>
        </nav>

        {/* Bottom nav — Settings already lives under Platform per the
            Figma, so the only thing left down here is the way out. */}
        <div className="border-t border-border px-4 py-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
