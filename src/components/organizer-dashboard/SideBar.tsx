import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EventraLogo } from '../icons/eventra-logo';
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
 { icon: LayoutDashboard, label: 'Overview', path: '/organizer-dashboard' },
  { icon: Calendar, label: 'Events', path: '/organizer-dashboard/events' },
  { icon: Users, label: 'Attendees', path: '/organizer-dashboard/attendees' },
  { icon: CheckSquare, label: 'Check-in', path: '/organizer-dashboard/checkin' },
  { icon: Wallet, label: 'Payouts', path: '/organizer-dashboard/payouts' },
  { icon: Megaphone, label: 'Promotions', path: '/organizer-dashboard/promotions' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/profile-settings' },
  { icon: Home, label: 'Back to site', path: '/' },
];

const SideBar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-[#EFEEED] flex flex-col h-screen">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <div className='flex flex-row items-center'>
          <EventraLogo />
          <span className="text-2xl font-[Schibsted Grotesk] font-bold text-[#1A1523]">Eventra</span>
        </div>
        <div className="bg-[#BBE0CF] px-2 py-0.5 rounded-[6px]">
          <p className="font-[Space Mono] text-[10px] font-bold text-[#0F6E56] uppercase tracking-wider">
            ORGANIZER
          </p>
        </div>
      </div>

      {/* Organization Selector */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <button className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">LL</div>
            <span className="text-sm font-medium text-gray-900">Lagos Live Co.</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Manage</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#EBF8F1] text-[#0F6E56]'
                  : 'text-[#6E6577] hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-[#0F6E56]' : 'text-[#6E6577]'}`} />
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
      <div className="border-t border-gray-200 px-4 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Account</p>
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6E6577] hover:bg-gray-50 transition-colors"
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