import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import EventraLogo from '/src/assets/Eventra-logo.png';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  Wallet,
  Megaphone,
  Settings,
  Home,
  ChevronDown
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/overview' },
  { icon: Calendar, label: 'Events', path: '/dashboard/events' },
  { icon: Users, label: 'Attendees', path: '/dashboard/attendees' },
  { icon: CheckSquare, label: 'Check-in', path: '/dashboard/check-in' },
  // No payouts page exists yet — kept visible and styled like a normal
  // nav item (not greyed out), but it doesn't go anywhere yet.
  { icon: Wallet, label: 'Payouts', path: null },
  { icon: Megaphone, label: 'Promotions', path: '/dashboard/promotion' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/profile' },
  { icon: Home, label: 'Back to site', path: '/' },
];

interface SideBarProps {
  organization: {
    name: string;
    logo?: string | null;
  };
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

const SideBar: React.FC<SideBarProps> = ({ organization }) => {
  const location = useLocation();
  const orgInitials = getInitials(organization?.name);
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <div className='flex flex-row items-center'>
          <img src={EventraLogo} onClick={() => navigate('/')} alt="Eventra Logo" className="h-8 w-8" />
          <span className="text-2xl font-grotesk font-bold text-foreground">Eventra</span>
        </div>
        <div className="bg-[#BBE0CF] dark:bg-[#0F6E56]/15 px-2 py-0.5 rounded-[6px]">
          <p className="font-space text-[10px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wider">
            ORGANIZER
          </p>
        </div>
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
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#EBF8F1] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]'
                  : 'text-muted-foreground hover:bg-accent'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-[#0F6E56] dark:text-[#4ADE80]' : 'text-muted-foreground'}`} />
                {item.label}
              </div>
              {item.label === 'Attendees' && (
                <span className="bg-[#F59E0B] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">3</span>
              )}
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;