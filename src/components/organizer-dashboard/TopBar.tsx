import React from 'react';
import { Bell, Plus, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { useTheme } from '@/context/theme.context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TopBarProps {
  organization: {
    name: string;
    logo?: string | null;
  };
  onCreateEvent?: () => void;
  onMenuClick?: () => void;
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ organization, onCreateEvent, onMenuClick, title }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground bg-muted border border-border p-2 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <Tooltip>
            <TooltipTrigger
              render={<h1 className="text-left text-lg sm:text-xl font-grotesk font-semibold text-foreground truncate" />}
            >
              {title}
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        )}
        {organization?.name && (
          <Tooltip>
            <TooltipTrigger
              render={<span className="hidden sm:inline text-sm text-muted-foreground truncate" />}
            >
              · {organization.name}
            </TooltipTrigger>
            <TooltipContent>{organization.name}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0A5240] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create event</span>
        </button>

        <div className="hidden sm:block h-8 w-px bg-border mx-2" />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="relative text-muted-foreground hover:text-foreground transition-colors bg-muted border border-border p-2 rounded-lg shrink-0"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* No notifications backend exists yet — showing a permanently-on
            dot here was pure decoration, not a real signal. Re-add it once
            there's an actual notifications endpoint to drive it. */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors bg-muted border border-border p-2 rounded-lg shrink-0">
          <Bell className="h-5 w-5" />
        </button>

        <button
          className="h-9 w-9 rounded-full overflow-hidden bg-[#0F6E56] text-white flex items-center justify-center font-bold text-sm shrink-0"
          title={user?.fullname || "Account"}
        >
          <UserAvatar avatarUrl={user?.avatarUrl} name={user?.fullname} className="h-9 w-9 text-sm" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
