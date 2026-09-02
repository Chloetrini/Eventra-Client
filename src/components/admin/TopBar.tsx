import React from 'react';
import { Menu, Search, Sun, Moon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth.context';
import { useTheme } from '@/context/theme.context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notifications/notificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminTopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Previously there was no way to sign out from inside the admin console
  // at all — the avatar button did nothing, so the only way out was to
  // leave the console for the main site's navbar first. Same fix and same
  // pattern as the organizer dashboard's TopBar.
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
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4 ">
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

        {/* Notification Bell — real unread count + recent notifications,
            see components/notifications/NotificationBell.tsx. Matches the
            look of the outline/icon buttons on either side of it. */}
        <NotificationBell triggerClassName="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground" />

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1.5 rounded-full shrink-0 focus:outline-none"
            title={user?.fullname || "Admin"}
          >
            <span className="h-9 w-9 rounded-full overflow-hidden bg-[#1A1523] text-white flex items-center justify-center font-bold text-sm shrink-0">
              <UserAvatar avatarUrl={user?.avatarUrl} name={user?.fullname} className="h-9 w-9 text-sm bg-[#1A1523] text-white " />
            </span>
            <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullname}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer gap-2">
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

export default AdminTopbar;
