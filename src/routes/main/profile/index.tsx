
import ProfileHeader from '@/components/profile-settings/ProfileHeader';
import SettingsForm from "@/components/profile-settings/SettingsForm";
import NToggles from '@/components/profile-settings/NToggles';
import ProfileSettingsSkeleton from '@/components/profile-settings/ProfileSettingsSkeleton';
import { useAuth } from '@/context/auth.context';
import { toast } from 'react-toastify';
import PageWrapper from '@/components/pageWrapper';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  const handleSave = async (data: any) => {
    toast.info("Profile update isn't wired to the backend yet.");
  };

  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  if (!user) {
    return (
      <div className="px-4 py-20 text-center text-muted-foreground">
        You need to be signed in to view your profile.
      </div>
    );
  }

  const initials = (user.fullname ?? "")
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
const memberSince = typeof user.createdAt === "string"
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : '';

  return (
    <>
    
      <PageWrapper className='p-[20px]'>
          <ProfileHeader
            user={{
              fullName: user.fullname,
              email: user.email,
              memberSince,
              initials,
            }}
            />
          <SettingsForm
            user={{
              fullName: user.fullname,
              email: user.email,
              phone: typeof user.phone === "string" ? user.phone : undefined,
              city: typeof user.city === "string" ? user.city : undefined,
            }}
            onSave={handleSave}
            />
          <NToggles />
       
      </PageWrapper>
    
    </>
  );
}