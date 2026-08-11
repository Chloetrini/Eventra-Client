import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'reminders',
    title: 'Event reminders',
    description: "A nudge before events you're attending",
    defaultEnabled: true,
  },
  {
    id: 'weekly',
    title: 'Weekly picks',
    description: 'The best events near you, once a week',
    defaultEnabled: false,
  },
  {
    id: 'organizer',
    title: 'Organizer updates',
    description: 'News from organizer you follow',
    defaultEnabled: true,
  },
];

const NotificationToggles: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    NOTIFICATIONS.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.defaultEnabled }),
      {}
    )
  );

  const handleToggle = (id: string, checked: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: checked }));
  };

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
    <div className="container mx-auto w-11/12">
      <div className="flex flex-col justify-center items-start border border-[#E8E6E0] rounded-[20px] p-6 sm:p-10">
        <h2 className="font-[Schibsted Grotesk] font-semibold text-[#000000] text-[24px] sm:text-[34px] leading-1 tracking-[-2%] pb-10">
          Email notifications
        </h2>

        {NOTIFICATIONS.map((item) => (
          <div
            key={item.id}
            className="flex flex-row flex-wrap justify-between items-center w-full py-8 border-b border-[#E8E6E0] last:border-0 gap-6"
          >
            <div className="flex flex-col justify-center items-start gap-4 flex-1 min-w-50">
              <h3 className="font-[Schibsted Grotesk] font-semibold text-[#000000] text-[20px] sm:text-[28px] leading-1 tracking-[-2%]">
                {item.title}
              </h3>
              <p className="font-[Geist] font-medium text-[#6E6577] text-[14px] sm:text-[18px] leading-7.25 tracking-[-2%]">
                {item.description}
              </p>
            </div>
            <Switch
              {...({
                checked: toggles[item.id],
                onCheckedChange: (checked: boolean) => handleToggle(item.id, checked),
              } as any)}
              className="h-10 w-14.5 data-[state=checked]:bg-[#0F6E56] data-[state=unchecked]:bg-gray-200 [&>span]:h-10 [&>span]:w-10 [&>span]:data-[state=checked]:translate-x-[calc(100%-4px)] [&>span]:data-[state=unchecked]:translate-x-0.5 shrink-0"
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/tickets")}
          className="h-auto font-[Geist] font-medium text-[#0A4F41] text-[16px] sm:text-[18px] leading-7.25 tracking-normal hover:bg-transparent hover:border hover:border-[#0A4F41] rounded-[10px] p-2"
        >
          View order history <ArrowRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5 inline" />
        </Button>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center w-full sm:w-auto min-w-25 sm:min-w-31 h-10 sm:h-11.5 px-3 sm:px-3.5 py-2 sm:py-2..75 rounded-[7px] border border-[#BE2525] bg-transparent text-[#BE2525] font-[Geist] font-medium text-[14px] sm:text-[18px] leading-7.25 tracking-normal hover:bg-red-50 transition-colors duration-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default NotificationToggles;