import React from 'react';
import { Bell, Plus } from 'lucide-react';
import { useAuth } from '@/context/auth.context';

interface TopBarProps {
  organization: {
    name: string;
    logo?: string | null;
  };
  onCreateEvent?: () => void;
  title?: string;
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

const TopBar: React.FC<TopBarProps> = ({ organization, onCreateEvent, title }) => {
  const { user } = useAuth();
  const initials = getInitials(user?.fullname);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        {organization?.name && (
          <span className="text-sm text-gray-500">· {organization.name}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0A5240] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create event
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <button className="relative text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 border border-gray-200 p-2 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-[#F59E0B] rounded-full border-2 border-white" />
        </button>

        <button
          className="h-9 w-9 rounded-full bg-[#0F6E56] text-white flex items-center justify-center font-bold text-sm"
          title={user?.fullname || "Account"}
        >
          {initials}
        </button>
      </div>
    </header>
  );
};

export default TopBar;