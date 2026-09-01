import React from 'react';
import { Plus, Menu, Sun, Moon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth.context';
import { useTheme } from '@/context/theme.context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { NotificationBell } from '@/components/notifications/notificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Previously there was no way to sign out from inside the organizer
  // dashboard at all — the avatar button did nothing, so the only way out
  // was to leave the dashboard for the main site's navbar first. This
  // mirrors that navbar's own sign-out dropdown (components/ui/navbar.tsx).
  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out.");
      navigate("/auth/login");
    } catch (err) {
      toast.error("Could not sign out. Please try again.");
    }
  };

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

        {/* Notification Bell — real unread count + recent notifications,
            see components/notifications/NotificationBell.tsx. */}
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1.5 rounded-full shrink-0 focus:outline-none"
            title={user?.fullname || "Account"}
          >
            <span className="h-9 w-9 rounded-full overflow-hidden bg-[#0F6E56] text-white flex items-center justify-center font-bold text-sm shrink-0">
              <UserAvatar avatarUrl={user?.avatarUrl} name={user?.fullname} className="h-9 w-9 text-sm" />
            </span>
            <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullname}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="cursor-pointer gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer gap-2 text-[#BE2525] dark:text-red-400 focus:text-[#BE2525] dark:focus:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
