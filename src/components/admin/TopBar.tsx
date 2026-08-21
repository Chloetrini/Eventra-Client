import React from 'react';
import { Bell, Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { useTheme } from '@/context/theme.context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminTopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Title and Mobile Menu */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title && (
          <h1 className="text-left text-lg sm:text-xl font-grotesk font-semibold text-foreground truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search events, organizers, users..." 
          className="pl-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-[#0F6E56]"
        />
      </div>

      {/* Right: Actions and User */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notification Bell with Red Dot */}
        <Button
          variant="outline"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-card" />
        </Button>

        {/* User Avatar */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full overflow-hidden bg-[#1A1523] text-white flex items-center justify-center font-bold text-sm shrink-0 p-0"
          title={user?.fullname || "Admin"}
        >
          <UserAvatar avatarUrl={user?.avatarUrl} name={user?.fullname} className="h-9 w-9 text-sm" />
        </Button>
      </div>
    </header>
  );
};

export default AdminTopbar;